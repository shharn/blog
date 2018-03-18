package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"puppyloper.blog/data"
	"puppyloper.blog/util"
)

// CheckHandler is handler for "/check"
func CheckHandler(w http.ResponseWriter, r *http.Request) {
	var blogRequest data.BlogRequestBody
	if err := json.NewDecoder(r.Body).Decode(&blogRequest); err != nil {
		util.ErrorResponse(w, err, http.StatusBadRequest)
		return
	}

	blogToken := blogRequest.Token
	if len(blogToken) > 0 {
		var (
			isValid bool
			err     error
		)
		if isValid, err = validateToken(blogToken); err != nil {
			util.ErrorResponse(w, data.AppError{Code: 400, Message: "Invalid Token"}, http.StatusBadRequest)
			return
		}
		responseBody := data.BlogResponseBody{}
		responseBody.Authentication.IsAuthenticated = isValid
		util.JSONResponse(http.StatusOK, responseBody, w)
	}
}

func validateToken(tokenString string) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte("secret"), nil
	})
	if token.Valid {
		return true, nil
	}
	return false, err
}
