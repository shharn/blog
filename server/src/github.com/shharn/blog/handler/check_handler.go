package handler

import (
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/pkg/errors"
	"github.com/shharn/blog/config"
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/router"
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
	return nil, err
}

func validateToken(tokenString string) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.JWTSecretKey), nil
	})
	if token.Valid {
		return true, nil
	}
	if err != nil {
		return false, errors.WithStack(err)
	}
	return false, nil
}
