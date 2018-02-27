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
	adminEmail string = `test@test.com`
	// will change it to hashed value later at client
	adminPassword string = `test`
)

type (
	// ResponseBody is wrapper for json format response
	ResponseBody map[string]interface{}
	
	logininformation struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Token string `json:"token"`
	}
	
	// SessionStorage is memory-based storage for session data
	SessionStorage map[string]string

	// BlogToken : alias instead of string
	BlogToken string
	
	// AppError is for custom error
	AppError struct {
		Message string `json:"message"`
	}
)

func (e AppError) Error() string {
	return fmt.Sprintf("%v", e.Message)
}

var (
	Storage SessionStorage = SessionStorage{}
)

// LoginHandler is a handler for "/login"
func LoginHandler(response http.ResponseWriter, request *http.Request) {
	var info logininformation
	if err := json.NewDecoder(request.Body).Decode(&info); err != nil {
		util.ErrorResponse(response, err, http.StatusBadRequest)
		return
	}

	// In case client already has valid token
	

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
		util.ErrorResponse(response, AppError{err.Error()}, http.StatusInternalServerError)
		return
	}

	storeToken(tokenString, info.Email)
	responseBody := ResponseBody{
		"isAuthenticated": true,
		"token":           tokenString,
	}
	util.JsonResponse(http.StatusOK, responseBody, response)
}

func isAdminUser(info *logininformation) bool {
	return info.Email == adminEmail && info.Password == adminPassword
}

func makeToken(info *logininformation) *jwt.Token {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := make(jwt.MapClaims)
	claims["iat"] = time.Now().Unix()
	claims["email"] = info.Email
	token.Claims = claims
	return token
}

func storeToken(tokenString string, email string) {
	Storage[tokenString] = email
}


