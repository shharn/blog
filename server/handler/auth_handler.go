package handler

import (
	"fmt"
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
	"github.com/shharn/blog/session"
)

var (
	TokenName = "X-Session-Token"
	invalidAuthentication = model.Authentication{IsValid:false}
	sessionStorage = session.BlogSessionStorage()
	tokenMaker = session.BlogTokenMaker()
)

type oauthAuthCodeURLResponse struct {
	AuthCodeURL string `json:"authCodeURL"`
}

type AuthenticationHandler struct {
	authenticationService service.AuthenticationService
}

// LoginHandler is a handler for "POST /login"
func (h *AuthenticationHandler) LoginHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	var loginInfo model.LoginInformation
	if err := json.NewDecoder(r.Body).Decode(&loginInfo); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusBadRequest, "Fail to deserialize", errors.WithStack(err))
	}
	
	if len(loginInfo.Email) < 1 || len(loginInfo.Password) < 1 {
		return nil, router.NewErrorResponse(http.StatusUnauthorized, "Invalid email or password")
	}

	isValid := h.authenticationService.AuthenticateAdmin(loginInfo.Email, loginInfo.Password)
	if !isValid {
		return nil, router.NewErrorResponse(http.StatusUnauthorized, "Invalid email or password")
	}

	inputSession, err := session.GetSessionFromLoginInformation(loginInfo)
	if err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to create a session", err)
	}

	sessionToken, err := tokenMaker.Encode(inputSession)
	if err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to create a session", err)
	}
	sessionStorage.Put(sessionToken)
	return model.Authentication{
		IsValid: true,
		Token: sessionToken,
		Platform: inputSession.Platform,
		Admin: true,
	}, router.EmptyErrorResponse
}

// CheckHandler is handler for "/check"
func (h *AuthenticationHandler) CheckHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	clientToken := rq.Header.Get(TokenName)
	if len(clientToken) < 1 {
		return invalidAuthentication, router.EmptyErrorResponse
	}
	
	if !sessionStorage.Has(clientToken) {
		return invalidAuthentication, router.EmptyErrorResponse
	}

	rawSession, err := tokenMaker.Decode(clientToken)
	if err == nil {
		s := rawSession.(*session.Session)
		return model.Authentication{
			IsValid:true,
			Platform: s.Platform,
			Admin: s.Admin,
		}, router.EmptyErrorResponse
	}
	return invalidAuthentication, router.NewErrorResponseWithError(http.StatusOK, "Invalid token", err)
}

// OAuthLoginHandler handles login request with OAuth token
func (h *AuthenticationHandler) OAuthAuthorizationHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	platform := params["platform"].(string)
	if len(platform) < 1 {
		return nil, router.NewErrorResponse(http.StatusBadRequest, "Empty oauth2 platform")
	}

	url := h.authenticationService.AuthorizeWithOAuthProvider(platform)
	if len(url) < 1 {
		return nil, router.NewErrorResponse(http.StatusBadRequest, fmt.Sprintf("Unsupported oauth2 platform - %v", platform))
	}
	return oauthAuthCodeURLResponse{AuthCodeURL: url}, router.EmptyErrorResponse
}

func (h *AuthenticationHandler) OAuthCodeExchangeHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	platform := params["platform"].(string)
	authCode := params["code"].(string)
	logger.Tracef("[OAuthCodeExchangeHandler] platform - %v, authCode - %v", platform, authCode)
	if len(authCode) < 1 {
		return model.Authentication {
			IsValid: false,
			Platform: platform,
			Admin: false,
		}, router.EmptyErrorResponse
	}

	t, err := h.authenticationService.GetBlogTokenFromAuthCode(authCode, platform)
	if err != nil {
		return model.Authentication {
			IsValid: false,
			Platform: platform,
			Admin: false,
		}, router.NewErrorResponseWithError(http.StatusBadRequest, fmt.Sprintf("Invalid auth code. Platform - %v, authCode - %v", platform, authCode), err)
	}

	sessionStorage.Put(t)
	return model.Authentication{
		Token: t,
		IsValid: true,
		Platform: platform,
		Admin: false,
	}, router.EmptyErrorResponse
}

// LogoutHandler is the service for "POST /logout"
func (h *AuthenticationHandler) LogoutHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	tokenFromClient := r.Header.Get(TokenName)
	s, err := tokenMaker.Decode(tokenFromClient)
	logger.WithFields(logger.Tuples{
		"decoded_session": s,
	})("trace", "Decoded session")
	if err == nil {
		sessionStorage.Remove(tokenFromClient)
		return nil, router.EmptyErrorResponse
	}
	return nil, router.NewErrorResponse(http.StatusUnauthorized, "Invalid Token")
}

func NewAuthenticationHandler(authenticationService service.AuthenticationService) *AuthenticationHandler {
	return &AuthenticationHandler{authenticationService}
}