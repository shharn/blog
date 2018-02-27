package handler

import (
	"net/http"
	"encoding/json"
	"puppyloper.blog/util"
	"github.com/dgrijalva/jwt-go"
	"fmt"
)

// PuppyToken represents the token for this blog
type PuppyToken struct {
	// Token represents the jwt signed with secret
	Token string `json:"token"`
}

// CheckHandler is handler for "/check"
func CheckHandler(writer http.ResponseWriter, request *http.Request) {
	var puppyToken PuppyToken
	if err := json.NewDecoder(request.Body).Decode(&puppyToken); err != nil {
		util.ErrorResponse(writer, err, http.StatusBadRequest)
		return
	}
	fmt.Println(puppyToken)

	if len(puppyToken.Token) > 0 {
		var (
			isValid bool
			err error
		)
		if isValid, err = validateToken(puppyToken.Token); err != nil {
			util.ErrorResponse(writer, err, http.StatusBadRequest)
			return
		}
		responseBody := ResponseBody{}
		responseBody["isAuthenticated"] = isValid
		util.JsonResponse(http.StatusOK, responseBody, writer)
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