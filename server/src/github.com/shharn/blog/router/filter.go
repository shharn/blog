package router

import (
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/shharn/blog/data"
)

// Filter filters or pre-processes the request
// Can be used for authentication or something like that
type Filter interface {
	Filter(w http.ResponseWriter, r *http.Request) (bool, error)
}

// AuthFilter is responsible for validating the session token
type AuthFilter struct {
	// Key is the secret key for JWT
	Key string
}

// Filter in AuthFilter validates the token from the header
func (af AuthFilter) Filter(w http.ResponseWriter, r *http.Request) (bool, error) {
	path := strings.ToLower(r.URL.Path[1:])
	if r.Method == "GET" || path == "login" || path == "check" {
		return false, nil
	}
	clientToken := r.Header.Get("X-Session-Token")

	isValid, err := af.validateToken(clientToken, af.Key)
	if err != nil {
		return !isValid, data.AppError{Code: http.StatusBadRequest, Message: err.Error()}
	}
	return !isValid, nil
}

func (af AuthFilter) validateToken(token, key string) (bool, error) {
	if len(token) < 1 {
		return false, nil
	}
	parsedToken, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		return []byte("secret"), nil
	})

	if err != nil {
		// should log the information
		// but how?? and what??
		return false, err
	}

	return parsedToken.Valid, err
}

// CORSFilter just set CORS headers
type CORSFilter struct {
	CORSContext CORSContext
}

// Filter for CORSFilter
func (cf CORSFilter) Filter(w http.ResponseWriter, rq *http.Request) (bool, error) {
	w.Header().Set("Access-Control-Allow-Origin", cf.CORSContext.AllowedOrigins)
	w.Header().Set("Access-Control-Allow-Methods", cf.CORSContext.AllowedMethods)
	w.Header().Set("Access-Control-Allow-Headers", cf.CORSContext.AllowedHeaders)
	return false, nil
}
