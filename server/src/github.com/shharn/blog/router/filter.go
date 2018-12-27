package router

import (
	"net/http"
	"os"
	"strings"

	"github.com/shharn/blog/session"
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

	if isValid := session.TokenManager.ValidateToken(clientToken); isValid {
		return nil
	} else {
		return RouterError{
			Code: http.StatusUnauthorized,
			MessageForClient: "Invalid token",
			innerError: nil,
		}
	}
}

// CORSFilter just set CORS headers
type CORSFilter struct {
	CORSContext CORSContext
	// Exceptions is a list of FilterExceptionJudge
	Exceptions []FilterExceptionJudge
}

// Filter for CORSFilter
func (cf CORSFilter) Filter(w http.ResponseWriter, rq *http.Request) error {
	for _, judge := range cf.Exceptions {
		if judge(w, rq) {
			return nil
		} 
	}

	origin := rq.Header.Get("Origin")
	allowedOrigin := origin
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