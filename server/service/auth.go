package service

import (
	"context"
	"encoding/json"
	"os"
	"time"

	"github.com/pkg/errors"
	"github.com/shharn/blog/db"
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/session"
	goOAuth "golang.org/x/oauth2"
	 "golang.org/x/oauth2/google"
	googleOAuth "google.golang.org/api/oauth2/v2"
	googleOption "google.golang.org/api/option"
)

const (
	authenticationQuery = `
		query authenticate($email: string, $pswd: string) {
			result (func: eq(email, $email)) {
				isValid: checkpwd(pswd, $pswd)
			}
		}
	`

	googleOAuthClientIDEnvName = "GOOGLE_OAUTH_CLIENT_ID"
	googleOAuthClientSecretEnvName = "GOOGLE_OAUTH_CLIENT_SECRET"
	oauthCSRFStateEnvName = "OAUTH_CSRF_STATE"
	oauthHostOfRedirectURLEnvName = "OAUTH_HOST_OF_REDIRECT_URL"
)

var tokenMaker = session.BlogTokenMaker()

type authenticationPayload struct {
	Result []authenticationResult `json:"result,omitempty"`
}

type authenticationResult struct {
	IsValid bool `json:"isValid"`
}

type userInfo struct {
	ID string
	Name string
	PictureURL string
	Platform string
}

func (u userInfo) ToSession() session.Session {
	now := time.Now()
	s := session.Session{
		ID: u.ID,
		Name: u.Name,
		PictureURL: u.PictureURL,
		Platform: u.Platform,
		CreatedAt: now,
		ExpiredAt: now.Add(time.Hour * 2),
		Admin: false,
	}
	return s
}

type oauthAuthorization interface {
	GetAuthCodeURL() string
}

type tokenExchanger interface {
	Exchange(string) (interface{}, error)
}

type oauthProfileService interface {
	GetProfile(interface{}) (*userInfo, error)
}

type oauthService interface {
	oauthAuthorization
	tokenExchanger
	oauthProfileService
}

type googleOAuthService struct {}

func (gs *googleOAuthService) getConfig() *goOAuth.Config {
	cid := os.Getenv(googleOAuthClientIDEnvName)
	csrt := os.Getenv(googleOAuthClientSecretEnvName)
	endpoint := google.Endpoint
	scps := []string{googleOAuth.UserinfoProfileScope}
	rurl := os.Getenv(oauthHostOfRedirectURLEnvName)

	logger.WithFields(logger.Tuples{
		"ClientID": cid,
		"ClientSecret": csrt,
		"Endpoint": endpoint,
		"RedirectURL": rurl,
		"Scopes": scps,
	})("trace", "googleOAuthAuthorization.GetAuthCodeURL")

	conf := &goOAuth.Config{
		ClientID: cid,
		ClientSecret: csrt,
		Endpoint: endpoint,
		Scopes: scps,
		RedirectURL: rurl,
	}
	return conf
}

func (gs *googleOAuthService) GetAuthCodeURL() string {
	conf := gs.getConfig()
	stt := os.Getenv(oauthCSRFStateEnvName)
	url := conf.AuthCodeURL(stt, goOAuth.AccessTypeOnline)
	logger.WithFields(logger.Tuples{
		"url": url,
	})("trace", "googleOAuthAuthorization's return url")
	return url
}

func (gs *googleOAuthService) Exchange(authCode string) (interface{}, error) {
	conf := gs.getConfig()
	ctx := context.Background()
	tok, err := conf.Exchange(ctx, authCode) // (*Token, error)
	logger.WithFields(logger.Tuples{
		"authCode": authCode,
		"token": tok,
	})("trace", "googleTokenExchanger's result token")
	if err != nil {
		return nil, err
	}
	return tok, nil
}

func (gs *googleOAuthService) GetProfile(token interface{}) (*userInfo, error) {
	conf := gs.getConfig()
	ctx := context.Background()
	tok :=  token.(*goOAuth.Token)
	service, err  := googleOAuth.NewService(
		ctx,
		googleOption.WithScopes(googleOAuth.UserinfoProfileScope),
		googleOption.WithTokenSource(conf.TokenSource(ctx, tok)),
	)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	ms := googleOAuth.NewUserinfoV2MeService(service)
	call := ms.Get()
	if call == nil {
		return nil, errors.New("Has no call instance")
	}

	userinfoPlus, err := call.Do()
	if err != nil {
		return nil, errors.WithStack(err)
	}

	uinfo := &userInfo{
		Platform: session.OAuthPlatformGoogle,
		ID: userinfoPlus.Id,
		Name: userinfoPlus.Name,
		PictureURL: userinfoPlus.Picture,
	}
	return uinfo, nil
}

func oauthServiceFactory(platform string) oauthService {
	switch(platform) {
	case session.OAuthPlatformGoogle:
		return &googleOAuthService{}
	case session.OAuthPlatformFacebook:
		return nil
	case session.OAuthPlatformGithub:
		return nil
	default:
		logger.Warnf("Unsupported oauth platform - %v", platform)
		return nil
	}
}

// Authenticated receives email & password. Then check the parameters on Databse
// Dgraph server will throw the result
func Authenticate(email, password string) (bool, error) {
	var (
		err error
		c   *db.Client
	)
	c, err = db.Init()
	if err != nil {
		return false, err
	}
	defer c.Dispose()

	vars := map[string]string{
		"$email": email,
		"$pswd": password,
	}
	
	res, err2 := c.QueryWithVars(authenticationQuery, vars)
	defer c.Commit()
	if err2 != nil {
		return false, err2
	}

	authResult := authenticationPayload{}
	if err = json.Unmarshal(res.Json, &authResult); err != nil {
		return false, errors.WithStack(err)
	}

	if len(authResult.Result) < 1 {
		return false, nil
	}

	if authResult.Result[0].IsValid {
		return true, nil
	} else {
		return false, nil
	}
}

func AuthorizeWithOAuthProvider(platform string) string {
	logger.WithFields(logger.Tuples{
		"platform": platform,
	})("trace", "OAuth ID received")

	svc := oauthServiceFactory(platform)
	if svc == nil {
		return ""
	}
	url := svc.GetAuthCodeURL()
	return url
}

func GetBlogTokenFromAuthCode(authCode, platform string) (string, error) {
	svc := oauthServiceFactory(platform)
	tok, err := svc.Exchange(authCode)
	if err != nil {
		return "", err
	}
	profile, err := svc.GetProfile(tok)
	if err != nil {
		return "", err
	}
	s := profile.ToSession()

	blogToken, err := tokenMaker.Encode(s)
	if err != nil {
		return "", err
	}
	return blogToken, nil
}
