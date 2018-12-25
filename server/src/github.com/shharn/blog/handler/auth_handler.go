package handler

import (
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
	"github.com/shharn/blog/session"
)

// LoginHandler is a handler for "POST /login"
func LoginHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, error) {
	var loginInfo data.LoginInformation
	if err := json.NewDecoder(r.Body).Decode(&loginInfo); err != nil {
		return nil, errors.WithStack(err)
	}
	
	if len(loginInfo.Email) < 1 || len(loginInfo.Password) < 1 {
		return nil, router.RouterError{
				Code: http.StatusUnauthorized,
				MessageForClient: "Invalid email or password",
			}
	}

	if isValid, err := service.Authenticate(loginInfo.Email, loginInfo.Password); err != nil {
		return nil, err
	} else if !isValid {
		return nil, router.RouterError{
				Code: http.StatusUnauthorized,
				MessageForClient: "Invalid email or password",
			}
	}

	session.TokenManager.MakeToken(&loginInfo)
	clientToken := session.TokenManager.GetSignedTokenString()

	return data.Authentication{
		IsValid: true,
		Token:   clientToken,
	}, nil
}

// CheckHandler is handler for "/check"
func CheckHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	clientToken := rq.Header.Get(router.TokenName)
	isValid := session.TokenManager.ValidateToken(clientToken)
	return data.Authentication{
		IsValid: isValid,
	}, nil
}

// LogoutHandler is the service for "POST /logout"
func LogoutHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, error) {
	token := r.Header.Get(router.TokenName)
	if isValid := session.TokenManager.ValidateToken(token); isValid {
		session.TokenManager.RegenerateKey()
		return nil, nil
	} else {
		return nil, router.RouterError{
			Code: http.StatusUnauthorized,
			MessageForClient: "Invalid Token",
		}
	}
}
