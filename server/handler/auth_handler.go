package handler

import (
	"fmt"
	"encoding/json"
	"net/http"
	"time"

	"github.com/pkg/errors"
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
	"github.com/shharn/blog/session"
)

var (
	TokenName = "X-Session-Token"
	invalidEmailOrPasswordError = errors.New("Invalid email or password")
	validDurationOfToken = time.Hour * 2
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
		return nil, router.NewErrorResponse(http.StatusBadRequest, "Invalid email or password")
	}

	isValid := h.authenticationService.ValidateEmailAndPassword(loginInfo.Email, loginInfo.Password)
	if !isValid {
		return nil, router.NewErrorResponse(http.StatusBadRequest, "Invalid email or password")
	}

	token, err := h.authenticationService.CreateToken(loginInfo.Email, session.GetAdminSessionFromEmail)
	if err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, err.Error(), err)
	}

	h.authenticationService.StoreToken(token, validDurationOfToken)
	return model.Authentication{
		IsValid: true,
		Token: token,
		Platform: session.OAuthPlatformNative,
		Admin: true,
	}, router.EmptyErrorResponse
}

// CheckHandler is handler for "/check"
func (h *AuthenticationHandler) CheckHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	clientToken := rq.Header.Get(TokenName)
	if len(clientToken) < 1 {
		return model.InvalidAuthentication, router.EmptyErrorResponse
	}
	
	authentication, err := h.authenticationService.ValidateToken(clientToken)
	if err != nil {
		return authentication, router.NewErrorResponseWithError(http.StatusOK, err.Error(), err)
	}
	return authentication, router.EmptyErrorResponse
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

	h.authenticationService.StoreToken(t, validDurationOfToken)
	return model.Authentication{
		Token: t,
		IsValid: true,
		Platform: platform,
		Admin: false,
	}, router.EmptyErrorResponse
}

// LogoutHandler is the service for "POST /logout"
func (h *AuthenticationHandler) LogoutHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	token := r.Header.Get(TokenName)
	h.authenticationService.RevokeToken(token)
	return nil, router.EmptyErrorResponse
}

func NewAuthenticationHandler(authenticationService service.AuthenticationService) *AuthenticationHandler {
	return &AuthenticationHandler{authenticationService}
}