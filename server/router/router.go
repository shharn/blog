package router

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/pkg/errors"
	"github.com/shharn/blog/logger"
)

var (
	mapStatusCodeToMessage = map[int]string{
		http.StatusBadRequest: "Bad Request",
		http.StatusUnauthorized: "Invalid authentication data",
		http.StatusForbidden: "Not allowed to do it",
		http.StatusNotFound: "Not Found",
		http.StatusMethodNotAllowed: "Not Allowed Method",
		http.StatusRequestTimeout: "Request Timeout",
		http.StatusConflict: "Conflict",
		http.StatusInternalServerError: "The Server is temporaliy unavailable. Try later",
	}
)

// Handler processes the client's request and return something
// The argument will be the unmarshalled body & route parameter values & values in Query String
// the object of return value({}interface) will be processed by marshaler
type Handler func(http.ResponseWriter, *http.Request, Params) (interface{}, ErrorResponse)

type corsContext struct {
	AllowedOrigins []string
	AllowedMethods string
	AllowedHeaders string
}

type routerContext struct {
	Pattern string
	Handler Handler
}

// Router is router - self-explanatory
type Router struct {
	RegisteredMethods []string
	CORSContext       *corsContext
	Dispatchers       map[string][]routerContext
	Filters           []Filter
	Marshaler         Marshaler
}

// SetCORS sets the CORS Enabled mode flag
func (r *Router) SetCORS() *Router {
	r.ensureCORSContext()
	browserAgents := []string{"Firefox", "Seamonkey", "Chrome", "Chromium", "Safari", "OPR", "Opera", "MSIE"}
	r.RegisteredMethods = append(r.RegisteredMethods, "OPTIONS")
	ctxs := []routerContext{}
	ctxs = append(ctxs, routerContext{
		Pattern: "*",
		Handler: func(w http.ResponseWriter, rq *http.Request, params Params) (interface{}, ErrorResponse) {
			return nil, EmptyErrorResponse
		},
	})
	(*r).Dispatchers["OPTIONS"] = ctxs
	r.Use(corsFilter{
		CORSContext: r.CORSContext,
		Exceptions: []FilterExceptionJudge{
			0: func(w http.ResponseWriter, r *http.Request) bool {
				path := r.URL.Path
				return path == "/"
			},
			1: func(w http.ResponseWriter, r *http.Request) bool {
				ua := r.Header.Get("User-Agent")
				for _, rua := range browserAgents {
					if strings.Contains(ua, rua) {
						return false
					}
				}
				return true
			},
		},
	})
	return r
}

func (r *Router) ensureCORSContext() {
	if r.CORSContext == nil {
		r.CORSContext = &corsContext{}
	}
}

// SetAllowedOrigin sets the allowed origins
func (r *Router) SetAllowedOrigin(origins []string) *Router {
	r.ensureCORSContext()
	r.CORSContext.AllowedOrigins = origins
	return r
}

// SetAllowedMethod sets the allowed methods
func (r *Router) SetAllowedMethod(methods string) *Router {
	r.ensureCORSContext()
	r.CORSContext.AllowedMethods = methods
	return r
}

// SetAllowedHeaders sets the allowed headers
func (r *Router) SetAllowedHeaders(headers string) *Router {
	r.ensureCORSContext()
	r.CORSContext.AllowedHeaders = headers
	return r
}

// Use registers middleware
func (r *Router) Use(filter Filter) {
	if r.Filters == nil {
		r.Filters = []Filter{}
	}
	r.Filters = append(r.Filters, filter)
}

// Get registers the handler, filters, post-filters for the path on "GET" method
func (r *Router) Get(path string, handler Handler) {
	r.add("GET", path, handler)
}

// Post registers the handler, filters, post-filters for the path on "POST" method
func (r *Router) Post(path string, handler Handler) {
	r.add("POST", path, handler)
}

// Patch registers the handler, filters, post-filters for the path on "PATCH" method
func (r *Router) Patch(path string, handler Handler) {
	r.add("PATCH", path, handler)
}

// Put registers the handler, filters, post-filters for the path on "PUT" method
func (r *Router) Put(path string, handler Handler) {
	r.add("PUT", path, handler)
}

// Delete registers the handler, filters, post-filters for the path on "DELETE" method
func (r *Router) Delete(path string, handler Handler) {
	r.add("DELETE", path, handler)
}

func (r *Router) add(method, path string, handler Handler) {
	r.RegisteredMethods = append(r.RegisteredMethods, method)
	newCtx := routerContext{
		Pattern: path,
		Handler: handler,
	}
	ctxs, exist := (*r).Dispatchers[method]
	if !exist {
		ctxs = []routerContext{}
	}
	ctxs = append(ctxs, newCtx)
	(*r).Dispatchers[method] = ctxs
}

// ServerHTTP is the http.Handler interface method
func (r *Router) ServeHTTP(w http.ResponseWriter, rq *http.Request) {
	defer func() {
		if rcv := recover(); rcv != nil {
			if err, ok  := rcv.(error); ok {
				wrapped := errors.Wrap(err, "Unexpected error")
				logger.Error(wrapped)
			} else {
				err = errors.New(fmt.Sprintf("%v", rcv))
				logger.Error(err)
			}
			w.WriteHeader(http.StatusInternalServerError)
		}
	}()

	ok, errResponse := r.consume(w, rq);
	if !ok {
		var err error
		if errResponse.InnerError != nil {
			err = errors.Wrap(errResponse.InnerError, errResponse.Message)
		} else {
			err = errors.New(errResponse.Message)
		}
		logger.Error(err)
		bytes, _ := r.Marshaler.Marshal(errResponse)
		ct := r.Marshaler.ContentType()
		w.Header().Set("Content-Type", ct)
		w.WriteHeader(errResponse.Code)
		w.Write(bytes)
	}
}

func (r *Router) consume(w http.ResponseWriter, rq *http.Request) (bool, ErrorResponse) {
	if exists := contains(r.RegisteredMethods, rq.Method); !exists {
		return false, NewErrorResponse(http.StatusMethodNotAllowed, mapStatusCodeToMessage[http.StatusMethodNotAllowed])
	}
	for _, filter := range r.Filters {
		if ok, errorResponse := filter.Filter(w, rq); !ok {
			return false, errorResponse
		}
	}
	
	ctxs, ok := (*r).Dispatchers[rq.Method]
	if ok != true {
		return false, NewErrorResponse(http.StatusNotFound, mapStatusCodeToMessage[http.StatusNotFound])
	}

	path := rq.URL.EscapedPath()
	ctx, found := findContextFromPath(ctxs, path)
	if !found {
		return false, NewErrorResponse(http.StatusNotFound, mapStatusCodeToMessage[http.StatusNotFound])
	}

	params := parseURL(ctx.Pattern, path)
	result, errResponse := ctx.Handler(w, rq, params)
	if errResponse != EmptyErrorResponse {
		return false, errResponse
	}

	bytes, err := r.Marshaler.Marshal(result)
	if err != nil {
		return false, NewErrorResponseWithError(http.StatusInternalServerError, mapStatusCodeToMessage[http.StatusInternalServerError], err)
	}
	ct := r.Marshaler.ContentType()
	w.Header().Set("Content-Type", ct)
	w.WriteHeader(http.StatusOK)
	if bytes != nil {
		w.Write(bytes)
	}
	return true, EmptyErrorResponse
}

func contains(list []string, value string) bool {
	for _, element := range list {
		if element == value {
			return true
		}
	}
	return false
}

func findContextFromPath(ctxs []routerContext, path string) (routerContext, bool) {
	wildCardIdx := -1
	for idx, ctx := range ctxs {
		if ctx.Pattern == "*" {
			wildCardIdx = idx
			break;
		}

		if MatchPathToPattern(ctx.Pattern, path) {
			return ctx, true
		}
	}
	if wildCardIdx != -1 {
		return ctxs[wildCardIdx], true
	}
	return routerContext{}, false
}

func MatchPathToPattern(pattern, path string) bool {
	splittedPattern, splittedPath := strings.Split(pattern, "/"), strings.Split(path, "/")
	if len(splittedPattern) != len(splittedPath) {
		return false
	}

	for idx, patternSlice := range splittedPattern {
		if len(patternSlice) < 1 && len(splittedPath[idx]) > 0 {
			return false
		}
		if len(patternSlice) > 0 && patternSlice[0] != ':' && patternSlice != splittedPath[idx] {
			return false
		}
	}
	return true
}

// NewRouter creates a new router
func NewRouter(marshaler Marshaler) *Router {
	return &Router{
		RegisteredMethods: []string{},
		Dispatchers:       map[string][]routerContext{},
		Filters:           []Filter{},
		Marshaler:         marshaler,
	}
}
