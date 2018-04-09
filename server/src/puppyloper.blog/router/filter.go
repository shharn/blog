package router

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
)

// FilterError is thrown by the Filter
type FilterError struct {
	Code int
}

// Errors is
func (f FilterError) Errors() string {
	return string(f.Code)
}

// Filter filters or pre-processes the request
// Can be used for authentication or something like that
type Filter interface {
	Filter(w http.ResponseWriter, r *http.Request) (filtered bool, err FilterError)
}

// AuthFilter is responsible for validating the session token
type AuthFilter struct {
	// Key is the secret key for JWT
	Key string
}

// Filter in AuthFilter validates the token from the header
func (af *AuthFilter) Filter(w http.ResponseWriter, r *http.Request) (bool, FilterError) {
	tokenString := r.Header.Get("X-Session-Token")
	isValid, err := af.validateToken(tokenString, af.Key)
	return isValid, FilterError{Code: http.StatusBadRequest}
}

func (af *AuthFilter) validateToken(token, key string) (bool, error) {
	parsedToken, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		return []byte("secret"), nil
	})

	if err != nil {
		// should log the information
		// but how?? and what??
		return false, err
	}

	if parsedToken.Valid {
		return true, nil
	}
}
