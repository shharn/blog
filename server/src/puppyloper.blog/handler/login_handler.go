package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
	"github.com/dgrijalva/jwt-go"
	"puppyloper.blog/util"
)

const (
	AdminEmail    string = `test@test.com`
	AdminPassword string = `test`
)

type LoginInformation struct {
	Email    string
	Password string
}

type BlogToken struct {
	Token string
}

type AppError  struct{
	ErrorMessage string
}

func (e AppError) Error() string {
	return fmt.Sprintf("%v", e.ErrorMessage)
}

// Handler for "/login"
func LoginHandler(response http.ResponseWriter, request *http.Request) {
	var info LoginInformation
	if err := json.NewDecoder(request.Body).Decode(&info); err != nil {
		util.ErrorResponse(response, err, http.StatusBadRequest)
		return
	}

	if !isAdminUser(&info) {
		util.ErrorResponse(response, AppError{"Invalid Email or Password"}, http.StatusUnauthorized)
		return
	}

	token := makeToken(&info)
	var (
		tokenString string
		err         error
	)
	if tokenString, err = token.SignedString([]byte("secret")); err != nil {
		util.ErrorResponse(response, err, http.StatusInternalServerError)
		return
	}
	jsonResponse := BlogToken{tokenString}
	util.JsonResponse(http.StatusOK, jsonResponse, response)
}

func isAdminUser(info *LoginInformation) bool {
	return info.Email == AdminEmail && info.Password == AdminPassword
}

func makeToken(info *LoginInformation) *jwt.Token {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := make(jwt.MapClaims)
	claims["iat"] = time.Now().Unix()
	claims["email"] = info.Email
	token.Claims = claims
	return token
}
