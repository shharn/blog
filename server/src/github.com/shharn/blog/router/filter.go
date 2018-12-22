package router

import (
	"net/http"
	"os"
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

// FilterExceptionJudge checks if current request is special case
type FilterExceptionJudge func(w http.ResponseWriter, r *http.Request) bool

// AuthFilter is responsible for validating the session token
type AuthFilter struct {
	// Key is the secret key for JWT
	Key string
	// Exceptions is a list of FilterExceptionJudge
	Exceptions []FilterExceptionJudge
}

// Filter in AuthFilter validates the token from the header
func (af AuthFilter) Filter(w http.ResponseWriter, r *http.Request) error {
	for _, judge := range af.Exceptions {
		if judge(w, r) {
			return nil
		} 
	}

	clientToken := r.Header.Get(TokenName)

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
	// Exceptions is a list of FilterExceptionJudge
	Exceptions []FilterExceptionJudge
}

// Filter for CORSFilter
func (cf CORSFilter) Filter(w http.ResponseWriter, rq *http.Request) error {
	isException := false
	for _, judge := range cf.Exceptions {
		if judge(w, rq) {
			isException = true
			break
		}
	}
	
	origin := rq.Header.Get("Origin")
	allowedOrigin := origin
	if !isException {
		currentEnv := os.Getenv("ENVIRONMENT")
		if currentEnv == "development" {
			allowedOrigin = "*"
		} else {
			if contains(cf.CORSContext.AllowedOrigins, origin) {
				allowedOrigin = origin
			} else {
				return RouterError{
					Code: http.StatusForbidden,
					MessageForClient: "You're not allowed",
				}
			}
		}
	}
	w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
	w.Header().Set("Access-Control-Allow-Methods", cf.CORSContext.AllowedMethods)
	w.Header().Set("Access-Control-Allow-Headers", cf.CORSContext.AllowedHeaders)
	return nil
}

func  getOriginFromRequest(rq *http.Request) string {
	rawOrigin := rq.Header.Get("Origin")
	trimmed := strings.TrimSpace(rawOrigin)
	if len(trimmed) < 1 {
		return ""
	}
	schemaAndPath := strings.Split(trimmed, "://")
	if len(schemaAndPath) == 2 {
		return schemaAndPath[1]
	} else {
		return ""
	}
}