package main

import (
	"net/http"
	"os"
	"strings"

	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/session"
)

var tokenMaker = session.BlogTokenMaker()

type LogFilter struct {}

func (lf LogFilter) Filter(w http.ResponseWriter, rq *http.Request) (bool, router.ErrorResponse) {
	ua := rq.Header.Get("User-Agent")
	if (!strings.Contains(ua, "GoogleHC")) {
		logger.WithFields(logger.Tuples{
			"headers": rq.Header,
			"client_ip": getClientAddress(rq),
			"method": rq.Method,
			"requestURI": rq.RequestURI,
			"params": rq.URL.Query(),
		})("info", "Incoming http request log")
	}
	return true, router.EmptyErrorResponse
}

func getClientAddress(rq *http.Request) string {
	currentEnv := os.Getenv("ENVIRONMENT")
	if currentEnv == "development" {
		return rq.RemoteAddr
	} else if (currentEnv == "production") {
		return rq.Header.Get("X-Forwarded-For")
	} else {
		return ""
	}
}

type AuthFilterFunc func(http.ResponseWriter, *http.Request) bool

type TargetContext struct {
	Path string
	Method string
	FilterFunc AuthFilterFunc
}

// AuthFilter is responsible for validating the session token
type AuthFilter struct {
	TargetContexts []*TargetContext
}

// Filter in AuthFilter validates the token from the header
func (af AuthFilter) Filter(w http.ResponseWriter, r *http.Request) (bool, router.ErrorResponse) {
	ok, tctx := af.isTarget(r.URL.EscapedPath(), r.Method)
	if !ok {
		return true, router.EmptyErrorResponse
	}

	pass := tctx.FilterFunc(w, r)
	if !pass {
		return false, router.NewErrorResponse(http.StatusUnauthorized, "Unauthorized request")
	}
	return true, router.EmptyErrorResponse
}

func (af AuthFilter) isTarget(path, method string) (bool, *TargetContext) {
	for _, tctx := range af.TargetContexts {
		if router.MatchPathToPattern(tctx.Path, path) && tctx.Method == method {
			return true, tctx
		}
	}
	return false, nil
}