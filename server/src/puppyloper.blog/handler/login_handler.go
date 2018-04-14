package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"puppyloper.blog/config"
	"puppyloper.blog/data"
	"puppyloper.blog/router"
)

const (
	adminEmail string = `test@test.com`
	// will change it to hashed value later at client
	adminPassword string = `test`
)

// LoginHandler is a handler for "POST /login"
func LoginHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, error) {
	var loginInfo data.LoginInformation
	if err := json.NewDecoder(r.Body).Decode(&loginInfo); err != nil {
		return nil, data.AppError{Code: http.StatusBadRequest, Message: err.Error()}
	}

	if len(loginInfo.Email) < 1 || len(loginInfo.Password) < 1 {
		return nil, data.AppError{Code: http.StatusBadRequest, Message: "Has no information"}
	}

	if !isAdminUser(&loginInfo) {
		return nil, data.AppError{Code: http.StatusUnauthorized, Message: "Invalid Email or Password"}
	}

	token := makeToken(&loginInfo)
	var (
		tokenString string
		err         error
	)
	if tokenString, err = token.SignedString([]byte(config.JWTSecretKey)); err != nil {
		return nil, data.AppError{Code: http.StatusInternalServerError, Message: err.Error()}
	}

	storeToken(tokenString, loginInfo.Email)
	return data.Authentication{
		IsAuthenticated: true,
		Token:           tokenString,
	}, nil
}

func isAdminUser(info *data.LoginInformation) bool {
	return info.Email == adminEmail && info.Password == adminPassword
}

func makeToken(info *data.LoginInformation) *jwt.Token {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := make(jwt.MapClaims)
	claims["iat"] = time.Now().Unix()
	claims["email"] = info.Email
	token.Claims = claims
	return token
}

func storeToken(tokenString string, email string) {
	data.TokenStorage[tokenString] = email
}
