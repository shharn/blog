package router

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/pkg/errors"
	"github.com/shharn/blog/logger"
	log "github.com/sirupsen/logrus"
)

const (
	// TokenName represents header name which contains session token data
	TokenName = "X-Session-Token"
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

// RouterError is a error type in this router context
type RouterError struct {
	Code             int `json:"-"`
	MessageForClient string `json:"message,omitempty"`
	innerError       error
}

func (ge RouterError) Error() string {
	return fmt.Sprintf("StatusCode: %v, Message: %v", ge.Code, ge.MessageForClient)
}

// Handler processes the client's request and return something
// The argument will be the unmarshalled body & route parameter values & values in Query String
// the object of return value({}interface) will be processed by marshaler
type Handler func(http.ResponseWriter, *http.Request, Params) (interface{}, error)

// CORSContext includes the Headers about CORS Configs
// It will be used at the handler for "OPTIONS" method
type CORSContext struct {
	AllowedOrigins []string
	AllowedMethods string
	AllowedHeaders string
}

// RouterContext includes the information for the routing
type RouterContext struct {
	Pattern string
	Handler Handler
}

// Router is router - self-explanatory
type Router struct {
	RegisteredMethods []string
	CORSEnabled       bool
	CORSContext       CORSContext
	Dispatchers       map[string][]RouterContext
	Filters           []Filter
	Marshaler         Marshaler
}

// SetCORS sets the CORS Enabled mode flag
func (r *Router) SetCORS() *Router {
	r.RegisteredMethods = append(r.RegisteredMethods, "OPTIONS")
	r.CORSEnabled = true
	ctxs := []RouterContext{}
	ctxs = append(ctxs, RouterContext{
		Pattern: "*",
		Handler: func(w http.ResponseWriter, rq *http.Request, params Params) (interface{}, error) {
			// w.Header().Set("Access-Control-Allow-Origin", r.CORSContext.AllowedOrigins)
			// w.Header().Set("Access-Control-Allow-Methods", r.CORSContext.AllowedMethods)
			// w.Header().Set("Access-Control-Allow-Headers", r.CORSContext.AllowedHeaders)
			return nil, nil
		},
	})
	(*r).Dispatchers["OPTIONS"] = ctxs
	r.Use(CORSFilter{CORSContext: r.CORSContext})
	return r
}

// SetAllowedOrigin sets the allowed origins
func (r *Router) SetAllowedOrigin(origins []string) *Router {
	r.CORSContext.AllowedOrigins = origins
	return r
}

// SetAllowedMethod sets the allowed methods
func (r *Router) SetAllowedMethod(methods string) *Router {
	r.CORSContext.AllowedMethods = methods
	return r
}

// SetAllowedHeaders sets the allowed headers
func (r *Router) SetAllowedHeaders(headers string) *Router {
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
	newCtx := RouterContext{
		Pattern: path,
		Handler: handler,
	}
	ctxs, exist := (*r).Dispatchers[method]
	if !exist {
		ctxs = []RouterContext{}
	}
	ctxs = append(ctxs, newCtx)
	(*r).Dispatchers[method] = ctxs
}

// ServerHTTP is the http.Handler interface method
func (r *Router) ServeHTTP(w http.ResponseWriter, rq *http.Request) {
	defer func() {
		if rcv := recover(); rcv != nil {
			if err, ok  := rcv.(error); ok {
				logger.Logger.Error(err)
			} else {
				err = errors.New(fmt.Sprintf("%v", rcv))
				logger.Logger.Error(err)
			}
			w.WriteHeader(http.StatusInternalServerError)
		}
	}()

	logger.Logger.WithFields(log.Fields{
		"headers": rq.Header,
		"client_ip": GetClientAddress(rq),
		"path": rq.URL.Path,
		"params": rq.URL.Query(),
		"token": rq.Header.Get(TokenName),
	}).Info("Incoming http request log")

	w.Header().Set("Content-Type", "application/json")
	err := r.consume(w, rq);
	if err != nil {
		if t, ok := err.(RouterError); ok {
			logger.Logger.ErrorWithMessage(t.Error(), t.innerError)
			bytes, _ := r.Marshaler.Marshal(t)
			w.WriteHeader(t.Code)
			w.Write(bytes)
		} else {
			logger.Logger.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}
}

func (r *Router) consume(w http.ResponseWriter, rq *http.Request) error {
	if exists := contains(r.RegisteredMethods, rq.Method); exists {
		for _, filter := range r.Filters {
			if err := filter.Filter(w, rq); err != nil {
				return err
			}
		}
		
		ctxs, ok := (*r).Dispatchers[rq.Method]
		if ok != true {
			return RouterError{
				Code:             http.StatusNotFound,
				MessageForClient: mapStatusCodeToMessage[http.StatusNotFound],
				innerError:       nil,
			}
		}

		path := rq.URL.Path
		ctx, found := findContextFromPath(ctxs, path)
		if !found {
			return RouterError{
				Code:             http.StatusNotFound,
				MessageForClient: mapStatusCodeToMessage[http.StatusNotFound],
				innerError:       nil,
			}
		}

		params := parseURL(ctx.Pattern, path)
		result, err := ctx.Handler(w, rq, params)
		if err != nil {
			return err
		}

		bytes, err := r.Marshaler.Marshal(result)
		if err != nil {
			return err
		}
		w.WriteHeader(http.StatusOK)
		if bytes != nil {
			w.Write(bytes)
		}
		return nil
	}
	return RouterError{
		Code:             http.StatusMethodNotAllowed,
		MessageForClient: mapStatusCodeToMessage[http.StatusMethodNotAllowed],
	}
}

func contains(list []string, value string) bool {
	for _, element := range list {
		if element == value {
			return true
		}
	}
	return false
}

func findContextFromPath(ctxs []RouterContext, path string) (RouterContext, bool) {
	wildCardIdx := -1
	for idx, ctx := range ctxs {
		if ctx.Pattern == "*" {
			wildCardIdx = idx
			break;
		}

		if matchPathToPattern(ctx.Pattern, path) {
			return ctx, true
		}
	}
	if wildCardIdx != -1 {
		return ctxs[wildCardIdx], true
	}
	return RouterContext{}, false
}

func matchPathToPattern(pattern, path string) bool {
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
func NewRouter() *Router {
	return &Router{
		RegisteredMethods: []string{},
		Dispatchers:       map[string][]RouterContext{},
		Filters:           []Filter{},
		Marshaler:         JSONMarshaler{},
	}
}

// GetClientAddress gives you a client IP
func GetClientAddress(rq *http.Request) string {
	currentEnv := os.Getenv("ENVIRONMENT")
	if currentEnv == "development" {
		return rq.RemoteAddr
	} else if (currentEnv == "production") {
		return rq.Header.Get("X-Forwarded-For")
	} else {
		return ""
	}
}