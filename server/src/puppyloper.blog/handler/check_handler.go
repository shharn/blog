package handler

import (
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"puppyloper.blog/config"
	"puppyloper.blog/data"
	"puppyloper.blog/router"
)

// CheckHandler is handler for "/check"
func CheckHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	clientToken := rq.Header.Get("X-Session-Token")
	isValid, err := validateToken(clientToken)
	if err == nil {
		return data.Authentication{
			Token:   clientToken,
			IsValid: isValid,
		}, nil
	}
	return nil, data.AppError{Code: http.StatusInternalServerError, Message: err.Error()}
}

func validateToken(tokenString string) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.JWTSecretKey), nil
	})
	if token.Valid {
		return true, nil
	}
	return false, err
}
