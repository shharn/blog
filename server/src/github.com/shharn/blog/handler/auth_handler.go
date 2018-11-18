package handler

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/pkg/errors"
	"github.com/shharn/blog/config"
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
)

// LoginHandler is a handler for "POST /login"
func LoginHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, error) {
	var (
		loginInfo data.LoginInformation
		tokenString string
		isValid bool
		err         error
	)
	if err := json.NewDecoder(r.Body).Decode(&loginInfo); err != nil {
		return nil, errors.WithStack(err)
	}

	
	if len(loginInfo.Email) < 1 || len(loginInfo.Password) < 1 {
		return nil, router.RouterError{
				Code: http.StatusUnauthorized,
				MessageForClient: "Invalid email or password",
			}
	}

	if isValid, err = service.Authenticate(loginInfo.Email, loginInfo.Password); err != nil {
		return nil, err
	} else if !isValid {
		return nil, router.RouterError{
				Code: http.StatusUnauthorized,
				MessageForClient: "Invalid email or password",
			}
	}

	token := makeToken(&loginInfo)
	
	if tokenString, err = token.SignedString([]byte(config.Key)); err != nil {
		return nil, errors.WithStack(err)
	}

	return data.Authentication{
		IsValid: true,
		Token:   tokenString,
	}, nil
}

func makeToken(info *data.LoginInformation) *jwt.Token {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := make(jwt.MapClaims)
	claims["iat"] = time.Now().Unix()
	claims["email"] = info.Email
	token.Claims = claims
	return token
}

// CheckHandler is handler for "/check"
func CheckHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	clientToken := rq.Header.Get("X-Session-Token")
	isValid, _ := validateToken(clientToken)
	return data.Authentication{
		IsValid: isValid,
	}, nil
}

func validateToken(tokenString string) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.Key), nil
	})
	if err != nil {
		return false, errors.WithStack(err)
	}
	return token.Valid, nil
}

// LogoutHandler is the service for "POST /logout"
func LogoutHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, error) {
	token := r.Header.Get("X-Session-Token")
	if isValid, err := validateToken(token); err != nil {
		return nil, err
	} else {
		if isValid {
			if err := RegenerateKey(); err != nil {
				return nil, err
			} else {
				return nil, nil
			} 
		} else {
			return nil, router.RouterError{
				Code: http.StatusUnauthorized,
				MessageForClient: "Invalid Token",
			}
		}
	}
}

// RegenerateKey is self-explanatory
func RegenerateKey() error {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return errors.WithStack(err)
	}
	config.Key = fmt.Sprintf("%x", b)
	return nil
}
