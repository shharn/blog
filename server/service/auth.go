package service

import (
	"time"

	"github.com/pkg/errors"
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/repository"
	"github.com/shharn/blog/session"
)

var (
	InvalidEmailOrPasswordError = errors.New("Invalid email or password")
	SessionCreationFailureError = errors.New("Fail to create a session")
	InvalidTokenError = errors.New("Invalid token")
)

type AuthenticationService interface {
	ValidateEmailAndPassword(string, string) bool
	CreateToken(string, session.AdminSessionTransformFunc) (string, error)
	ValidateToken(string) (model.Authentication, error)
	StoreToken(string, time.Duration)
	RevokeToken(string)
	AuthorizeWithOAuthProvider(string) string
	GetBlogTokenFromAuthCode(string, string) (string, error)
}

type BlogAuthenticationService struct {
	repo repository.AuthenticationRepository
	sessionStorage session.SessionStorage
	tokenMaker session.TokenMaker
}

func (s *BlogAuthenticationService) ValidateEmailAndPassword(email, password string) bool {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	valid, err := s.repo.Authenticate(ctx, email, password)
	if err != nil {
		logger.Error(err)
		return false
	}
	return valid
}

func (s *BlogAuthenticationService) CreateToken(email string, fn session.AdminSessionTransformFunc) (string, error) {
	inputSession, err := fn(email)
	if err != nil {
		return "", err
	}

	token, err := s.tokenMaker.Encode(inputSession)
	if err != nil {
		return "", err
	}
	return token, nil
}

func (s *BlogAuthenticationService) StoreToken(token string, d time.Duration) {
	s.sessionStorage.Put(token)
	go func() {
		time.Sleep(d)
		s.sessionStorage.Remove(token)
	}()
}

func (s *BlogAuthenticationService) ValidateToken(token string) (model.Authentication, error) {
	if !s.sessionStorage.Has(token) {
		return model.InvalidAuthentication, InvalidTokenError
	}

	rawSession, err := s.tokenMaker.Decode(token)
	if err == nil {
		s := rawSession.(*session.Session)
		return model.Authentication{
			IsValid:true,
			Platform: s.Platform,
			Admin: s.Admin,
		}, nil
	}
	s.sessionStorage.Remove(token)
	return model.InvalidAuthentication, err
}

func (s *BlogAuthenticationService) RevokeToken(token string) {
	s.sessionStorage.Remove(token)
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

	blogToken, err := s.tokenMaker.Encode(session)
	if err != nil {
		return "", err
	}
	return blogToken, nil
}

func NewAuthenticationService(r repository.AuthenticationRepository, s session.SessionStorage, tm session.TokenMaker) AuthenticationService {
	return &BlogAuthenticationService{r, s, tm}
}
