package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"puppyloper.blog/data"
	"puppyloper.blog/util"
)

// AuthMiddleware checks if client's request has valid token
// when the request method is kind of mutation
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// execute validation check when request method is one of the POST, PATCH, DELETE
		switch r.Method {
		case "POST":
		case "PATCH":
		case "DELETE":
			var blogRequest data.BlogRequestBody
			if err := json.NewDecoder(r.Body).Decode(&blogRequest); err != nil {
				util.ErrorResponse(w, data.AppError{
					Code:    http.StatusBadRequest,
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}
			fmt.Println(blogRequest)

			parsedToken, err := jwt.Parse(blogRequest.Token, func(token *jwt.Token) (interface{}, error) {
				return []byte("secret"), nil
			})

			if err != nil {
				util.ErrorResponse(w, data.AppError{
					Code:    http.StatusUnauthorized,
					Message: err.Error(),
				}, http.StatusUnauthorized)
				return
			}

			if parsedToken.Valid {
				next.ServeHTTP(w, r)
			} else {
				util.ErrorResponse(w, data.AppError{
					Code:    http.StatusUnauthorized,
					Message: "You are not allowed to do it",
				}, http.StatusUnauthorized)
				return
			}
		}
	})
}
