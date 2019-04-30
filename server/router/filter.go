package router

import (
	"net/http"
	"os"
)

// Filter filters or pre-processes the request
// Can be used for authentication or something like that
type Filter interface {
	Filter(w http.ResponseWriter, r *http.Request) (bool, ErrorResponse)
}

// FilterExceptionJudge checks if current request is special case
type FilterExceptionJudge func(w http.ResponseWriter, r *http.Request) bool

type corsFilter struct {
	CORSContext *corsContext
	Exceptions []FilterExceptionJudge
}

// Filter for CORSFilter
func (cf corsFilter) Filter(w http.ResponseWriter, rq *http.Request) (bool, ErrorResponse) {
	for _, judge := range cf.Exceptions {
		if judge(w, rq) {
			return true, EmptyErrorResponse
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
			return false, NewErrorResponse(http.StatusForbidden, "You're not allowed origin")
		}
	}
	w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
	w.Header().Set("Access-Control-Allow-Methods", cf.CORSContext.AllowedMethods)
	w.Header().Set("Access-Control-Allow-Headers", cf.CORSContext.AllowedHeaders)
	return true, EmptyErrorResponse
}