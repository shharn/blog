package simplerouter

import (
	"net/http"
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
// Can be used for handling CORS, Authentication and something like that
type Filter func(w http.ResponseWriter, r *http.Request) FilterError

// Handler processes the client's request and return something
// The argument will be the unmarshalled body & route parameter values & values in Query String
// the object of return value({}interface) will be processed by PostFilter
type Handler func(body interface{}, params ...interface{}) (interface{}, error)

// RawHandler is a handler that has arguments same as the http.ServeHTTP's
type RawHandler func(http.ResponseWriter, *http.Request)

// Marshaller processes the result of the Handler.
// I'll place the JSON Marshaller on it
type Marshaller func(result interface{}) ([]byte, error)

// CORSContext includes the Headers about CORS Configs
// It will be used at the handler for "OPTIONS" method
type CORSContext struct {
	AllowedOrigins string
	AllowedMethods string
	AllowedHeaders string
}

// RouterContext includes the information for the routing
type RouterContext struct {
	Path       string
	Filters    []Filter
	Handler    Handler
	RawHandler RawHandler
	Marshaller Marshaller
}

// Router is router - self-explanatory
type Router struct {
	CORSEnabled bool
	CORSContext CORSContext
	Dispatchers map[string][]RouterContext
}

// SetCORS sets the CORS Enabled mode flag
func (r *Router) SetCORS(use bool) {
	r.CORSEnabled = use
	if use {
		r.Dispatchers["OPTIONS"] = []RouterContext{
			0: {
				Path: "*",
				RawHandler: func(w http.ResponseWriter, rq *http.Request) {
					w.Header().Set("Access-Control-Allow-Origin", r.CORSContext.AllowedOrigins)
					w.Header().Set("Access-Control-Allow-Methods", r.CORSContext.AllowedMethods)
					w.Header().Set("Access-Control-Request-Headers", r.CORSContext.AllowedHeaders)
				},
			},
		}
	}
}

// SetAllowedOrigin sets the allowed origins
func (r *Router) SetAllowedOrigin(origins string) {
	r.CORSContext.AllowedOrigins = origins
}

// SetAllowedMethod sets the allowed methods
func (r *Router) SetAllowedMethod(methods string) {
	r.CORSContext.AllowedMethods = methods
}

// SetAllowedHeaders sets the allowed headers
func (r *Router) SetAllowedHeaders(headers string) {
	r.CORSContext.AllowedHeaders = headers
}

// Get registers the handler, filters, post-filters for the path on "GET" method
func (r *Router) Get(path string, handler Handler, filters []Filter, marshaller Marshaller) {
	r.add("GET", path, handler, filters, marshaller)
}

// Post registers the handler, filters, post-filters for the path on "POST" method
func (r *Router) Post(path string, handler Handler, filters []Filter, marshaller Marshaller) {
	r.add("POST", path, handler, filters, marshaller)
}

// Patch registers the handler, filters, post-filters for the path on "PATCH" method
func (r *Router) Patch(path string, handler Handler, filters []Filter, marshaller Marshaller) {
	r.add("PATCH", path, handler, filters, marshaller)
}

// Put registers the handler, filters, post-filters for the path on "PUT" method
func (r *Router) Put(path string, handler Handler, filters []Filter, marshaller Marshaller) {
	r.add("PUT", path, handler, filters, marshaller)
}

// Delete registers the handler, filters, post-filters for the path on "DELETE" method
func (r *Router) Delete(path string, handler Handler, filters []Filter, marshaller Marshaller) {
	r.add("DELETE", path, handler, filters, marshaller)
}

func (r *Router) add(method, path string, handler Handler, filters []Filter, marshaller Marshaller) {
	newCtx := RouterContext{
		Path:       path,
		Handler:    handler,
		Filters:    filters,
		Marshaller: marshaller,
	}
	ctxs, exist := (*r).Dispatchers[method]
	if exist == false {
		ctxs = []RouterContext{}
	}
	ctxs = append(ctxs, newCtx)
	(*r).Dispatchers[method] = ctxs
}

// ServerHTTP is the http.Handler interface method
func (r *Router) ServeHTTP(w http.ResponseWriter, rq *http.Request) {
	if exists := contains(AllowedMethods, rq.Method); exists == true {
		ctxs, ok := (*r).Dispatchers[rq.Method]
		if ok != true {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		path := rq.URL.Path
		ctx, found := findRightContextFromPath(ctxs, path)
		if found == false {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		for _, filter := range ctx.Filters {
			// Filter Error type
			// Filter Error { code: number, meessage: string }
			err := filter(w, rq)
			if err.Code != 0 {
				w.WriteHeader(err.Code)
				return
			}
		}

		// Before unmarshall Response.Body, should know the type of arguments of Handler
		// so I'll use reflect on Handler's Arguments
		//bodyType := reflect.TypeOf(ctx.handler).In(0)
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
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

func findRightContextFromPath(ctxs []RouterContext, path string) (RouterContext, bool) {
	wildCardIdx := -1
	for idx, ctx := range ctxs {
		if ctx.Path == "*" {
			wildCardIdx = idx
		}

		if path == ctx.Path {
			return ctx, true
		}
	}
	if wildCardIdx != -1 {
		return ctxs[wildCardIdx], true
	}
	return RouterContext{}, false
}

var (
	// AllowedMethods represents the methods processed by this router
	AllowedMethods = []string{
		"GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE",
	}
)

// NewRouter creates a new router
func NewRouter() *Router {
	return &Router{}
}
