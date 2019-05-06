package service

import (
	"context"
	"os"
	"time"

	"github.com/pkg/errors"
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/session"
	goOAuth "golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
   googleOAuth "google.golang.org/api/oauth2/v2"
   googleOption "google.golang.org/api/option"
)

const (
	googleOAuthClientIDEnvName = "GOOGLE_OAUTH_CLIENT_ID"
	googleOAuthClientSecretEnvName = "GOOGLE_OAUTH_CLIENT_SECRET"
	oauthCSRFStateEnvName = "OAUTH_CSRF_STATE"
	oauthHostOfRedirectURLEnvName = "OAUTH_HOST_OF_REDIRECT_URL"
)

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