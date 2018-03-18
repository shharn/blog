package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"puppyloper.blog/data"
	"puppyloper.blog/util"
)

const (
	adminEmail string = `test@test.com`
	// will change it to hashed value later at client
	adminPassword string = `test`
)

// LoginHandler is a handler for "/login"
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var blogRequest data.BlogRequestBody
	if err := json.NewDecoder(r.Body).Decode(&blogRequest); err != nil {
		util.ErrorResponse(w, err, http.StatusBadRequest)
		return
	}

	loginInfo := blogRequest.Data.LoginInformation
	if len(loginInfo.Email) < 1 || len(loginInfo.Password) < 1 {
		util.ErrorResponse(w, data.AppError{
			Code:    http.StatusBadRequest,
			Message: "Has no information",
		}, http.StatusBadRequest)
		return
	}

	if !isAdminUser(&loginInfo) {
		util.ErrorResponse(w, data.AppError{
			Code:    http.StatusUnauthorized,
			Message: "Invalid Email or Password",
		}, http.StatusUnauthorized)
		return
	}

	token := makeToken(&loginInfo)
	var (
		tokenString string
		err         error
	)
	if tokenString, err = token.SignedString([]byte("secret")); err != nil {
		util.ErrorResponse(w, data.AppError{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		}, http.StatusInternalServerError)
		return
	}

	storeToken(tokenString, loginInfo.Email)
	responseBody := data.BlogResponseBody{
		Authentication: data.Authentication{
			IsAuthenticated: true,
			Token:           tokenString,
		},
	}
	util.JSONResponse(http.StatusOK, responseBody, w)
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
