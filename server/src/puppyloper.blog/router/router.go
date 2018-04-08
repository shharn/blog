package router

import (
	"net/http"
)

// Handler processes the client's request and return something
// The argument will be the unmarshalled body & route parameter values & values in Query String
// the object of return value({}interface) will be processed by marshaler
type Handler func(http.ResponseWriter, *http.Request, Params) (interface{}, error)

// CORSContext includes the Headers about CORS Configs
// It will be used at the handler for "OPTIONS" method
type CORSContext struct {
	AllowedOrigins string
	AllowedMethods string
	AllowedHeaders string
}

// RouterContext includes the information for the routing
type RouterContext struct {
	Pattern   string
	Filters   []Filter
	Handler   Handler
	Marshaler Marshaler
}

// Router is router - self-explanatory
type Router struct {
	RegisteredMethods []string
	CORSEnabled       bool
	CORSContext       CORSContext
	Dispatchers       map[string][]RouterContext
}

// SetCORS sets the CORS Enabled mode flag
func (r *Router) SetCORS() *Router {
	r.RegisteredMethods = append(r.RegisteredMethods, "OPTIONS")
	r.CORSEnabled = true
	r.Dispatchers["OPTIONS"] = []RouterContext{
		0: {
			Pattern: "*",
			Handler: func(w http.ResponseWriter, rq *http.Request, params Params) (interface{}, error) {
				w.Header().Set("Access-Control-Allow-Origin", r.CORSContext.AllowedOrigins)
				w.Header().Set("Access-Control-Allow-Methods", r.CORSContext.AllowedMethods)
				w.Header().Set("Access-Control-Request-Headers", r.CORSContext.AllowedHeaders)
				return nil, nil
			},
		},
	}
	return r
}

// SetAllowedOrigin sets the allowed origins
func (r *Router) SetAllowedOrigin(origins string) *Router {
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

// Get registers the handler, filters, post-filters for the path on "GET" method
func (r *Router) Get(path string, handler Handler, filters []Filter, marshaler Marshaler) {
	if marshaler == nil {
		marshaler = JSONMarshaler{}
	}
	r.add("GET", path, handler, filters, marshaler)
}

// Post registers the handler, filters, post-filters for the path on "POST" method
func (r *Router) Post(path string, handler Handler, filters []Filter, marshaler Marshaler) {
	if marshaler == nil {
		marshaler = JSONMarshaler{}
	}
	r.add("POST", path, handler, filters, marshaler)
}

// Patch registers the handler, filters, post-filters for the path on "PATCH" method
func (r *Router) Patch(path string, handler Handler, filters []Filter, marshaler Marshaler) {
	if marshaler == nil {
		marshaler = JSONMarshaler{}
	}
	r.add("PATCH", path, handler, filters, marshaler)
}

// Put registers the handler, filters, post-filters for the path on "PUT" method
func (r *Router) Put(path string, handler Handler, filters []Filter, marshaler Marshaler) {
	if marshaler == nil {
		marshaler = JSONMarshaler{}
	}
	r.add("PUT", path, handler, filters, marshaler)
}

// Delete registers the handler, filters, post-filters for the path on "DELETE" method
func (r *Router) Delete(path string, handler Handler, filters []Filter, marshaler Marshaler) {
	if marshaler == nil {
		marshaler = JSONMarshaler{}
	}
	r.add("DELETE", path, handler, filters, marshaler)
}

func (r *Router) add(method, path string, handler Handler, filters []Filter, marshaler Marshaler) {
	newCtx := RouterContext{
		Pattern:   path,
		Handler:   handler,
		Filters:   filters,
		Marshaler: marshaler,
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
	if exists := contains(r.RegisteredMethods, rq.Method); exists == true {
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
		params := parseURL(ctx.Pattern, path)
		result, err := ctx.Handler(w, rq, params)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Error occured"))
			return
		}
		ctx.Marshaler.Marshal(result)
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
		if ctx.Pattern == "*" {
			wildCardIdx = idx
		}

		if path == ctx.Pattern {
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
	return &Router{
		RegisteredMethods: []string{},
	}
}
