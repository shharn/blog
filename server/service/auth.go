package service

import (
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/repository"
	"github.com/shharn/blog/session"
)

var tokenMaker = session.BlogTokenMaker()

type AuthenticationService interface {
	AuthenticateAdmin(string, string) bool
	AuthorizeWithOAuthProvider(string) string
	GetBlogTokenFromAuthCode(string, string) (string, error)
}

type BlogAuthenticationService struct {
	repo repository.AuthenticationRepository
}

// Authenticated receives email & password. Then check the parameters on Databse
// Dgraph server will throw the result
func (s *BlogAuthenticationService) AuthenticateAdmin(email, password string) bool {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	valid, err := s.repo.Authenticate(ctx, email, password)
	if err != nil {
		logger.Error(err)
		return false
	}
	return valid
}

func (s *BlogAuthenticationService) AuthorizeWithOAuthProvider(platform string) string {
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

func (s *BlogAuthenticationService) GetBlogTokenFromAuthCode(authCode, platform string) (string, error) {
	svc := oauthServiceFactory(platform)
	tok, err := svc.Exchange(authCode)
	if err != nil {
		return "", err
	}
	profile, err := svc.GetProfile(tok)
	if err != nil {
		return "", err
	}
	session := profile.ToSession()

	blogToken, err := tokenMaker.Encode(session)
	if err != nil {
		return "", err
	}
	return blogToken, nil
}

func NewAuthenticationService(r repository.AuthenticationRepository) AuthenticationService {
	return &BlogAuthenticationService{r}
}
