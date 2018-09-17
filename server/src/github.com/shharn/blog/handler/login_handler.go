package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/pkg/errors"
	"github.com/shharn/blog/config"
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/router"
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
		return nil, errors.WithStack(err)
	}

	
	if len(loginInfo.Email) < 1 || len(loginInfo.Password) < 1 {
		return data.Authentication{
			IsValid: false,
		}, nil
	}

	if !isAdminUser(&loginInfo) {
		fmt.Println("not matched")
		return data.Authentication{
			IsValid: false,
		}, nil
	}

	token := makeToken(&loginInfo)
	var (
		tokenString string
		err         error
	)
	if tokenString, err = token.SignedString([]byte(config.JWTSecretKey)); err != nil {
		return nil, errors.WithStack(err)
	}

	return data.Authentication{
		IsValid: true,
		Token:   tokenString,
	}, nil
}

func isAdminUser(info *data.LoginInformation) bool {
	fmt.Println(info.Email == adminEmail)
	fmt.Println(info.Password == adminPassword)
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
