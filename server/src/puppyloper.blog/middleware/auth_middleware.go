package middleware

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
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
		if r.Method == "GET" {
			next.ServeHTTP(w, r)
		} else if r.Method == "POST" || r.Method == "PATCH" || r.Method == "DELETE" {
			var (
				blogRequest data.BlogRequestBody
				buf         []byte
				err         error
			)
			if buf, err = ioutil.ReadAll(r.Body); err != nil {
				util.ErrorResponse(w, data.AppError{
					Code:    http.StatusInternalServerError,
					Message: err.Error(),
				}, http.StatusInternalServerError)
				return
			}
			clonedBody1 := ioutil.NopCloser(bytes.NewBuffer(buf))
			clonedBody2 := ioutil.NopCloser(bytes.NewBuffer(buf))

			if err := json.NewDecoder(clonedBody1).Decode(&blogRequest); err != nil {
				util.ErrorResponse(w, data.AppError{
					Code:    http.StatusBadRequest,
					Message: err.Error(),
				}, http.StatusBadRequest)
				return
			}
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
				r.Body = clonedBody2
				next.ServeHTTP(w, r)
			} else {
				util.ErrorResponse(w, data.AppError{
					Code:    http.StatusUnauthorized,
					Message: "You are not allowed to do it",
				}, http.StatusUnauthorized)
				return
			}
		} else {
			util.ErrorResponse(w, data.AppError{
				Code:    http.StatusMethodNotAllowed,
				Message: "Not Allowed Method",
			}, http.StatusMethodNotAllowed)
			return
		}
	})
}
