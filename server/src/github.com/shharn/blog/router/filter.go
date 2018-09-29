package router

import (
	"net/http"
	"strings"

	"github.com/shharn/blog/config"
	"github.com/dgrijalva/jwt-go"
	"github.com/pkg/errors"
)

// Filter filters or pre-processes the request
// Can be used for authentication or something like that
type Filter interface {
	Filter(w http.ResponseWriter, r *http.Request) error
}

// AuthFilter is responsible for validating the session token
type AuthFilter struct {
	// Key is the secret key for JWT
	Key string
}

// Filter in AuthFilter validates the token from the header
func (af AuthFilter) Filter(w http.ResponseWriter, r *http.Request) error {
	path := strings.ToLower(r.URL.Path[1:])
	// should be refactored
	if r.Method == "GET" || path == "login" || path == "check" || path == "logout" {
		return nil
	}
	clientToken := r.Header.Get("X-Session-Token")

	if isValid, err := af.validateToken(clientToken, af.Key); err == nil {
		if isValid {
			return nil
		} 
		return RouterError{
			Code: http.StatusUnauthorized,
			MessageForClient: "Invalid token",
			innerError: nil,
		}
	} else {
		return RouterError{
			Code: http.StatusInternalServerError,
			MessageForClient: mapStatusCodeToMessage[http.StatusInternalServerError],
			innerError: errors.WithStack(err),
		}
	}
}

func (af AuthFilter) validateToken(token, key string) (bool, error) {
	if len(token) < 1 {
		return false, nil
	}
	parsedToken, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		return []byte(config.Key), nil
	})

	if err != nil {
		return false, errors.WithStack(err)
	}
	return parsedToken.Valid, nil
}

// CORSFilter just set CORS headers
type CORSFilter struct {
	CORSContext CORSContext
}

// Filter for CORSFilter
func (cf CORSFilter) Filter(w http.ResponseWriter, rq *http.Request) error {
	w.Header().Set("Access-Control-Allow-Origin", cf.CORSContext.AllowedOrigins)
	w.Header().Set("Access-Control-Allow-Methods", cf.CORSContext.AllowedMethods)
	w.Header().Set("Access-Control-Allow-Headers", cf.CORSContext.AllowedHeaders)
	return nil
}
