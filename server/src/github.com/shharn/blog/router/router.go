package router

import (
	"fmt"
	"log"
	"net/http"
	"runtime/debug"
	"strings"
)

// GlobalError is a data structure for global error handling
type GlobalError struct {
	code             int
	MessageForClient string `json:"message,omitempty"`
	innerError       error
}

func (ge GlobalError) Error() string {
	return fmt.Sprintf("StatusCode: %v, Message: %v", ge.code, ge.MessageForClient)
}

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
			w.Header().Set("Access-Control-Allow-Origin", r.CORSContext.AllowedOrigins)
			w.Header().Set("Access-Control-Allow-Methods", r.CORSContext.AllowedMethods)
			w.Header().Set("Access-Control-Allow-Headers", r.CORSContext.AllowedHeaders)
			return nil, nil
		},
	})
	(*r).Dispatchers["OPTIONS"] = ctxs
	r.Use(CORSFilter{CORSContext: r.CORSContext})
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
	if exist == false {
		ctxs = []RouterContext{}
	}
	ctxs = append(ctxs, newCtx)
	(*r).Dispatchers[method] = ctxs
}

// ServerHTTP is the http.Handler interface method
func (r *Router) ServeHTTP(w http.ResponseWriter, rq *http.Request) {
	log.Printf("%s  %s %s %s", rq.Method, rq.URL, rq.Header.Get("X-Session-Token"), rq.RemoteAddr)

	defer func() {
		if rcv := recover(); rcv != nil {
			log.Printf("[Unhandled Error] : %s\nStackTrace : %s", rcv, debug.Stack())
			w.WriteHeader(http.StatusInternalServerError)
		}
	}()

	w.Header().Set("Content-Type", "application/json")
	globalError := func(w http.ResponseWriter, rq *http.Request) error {
		if exists := contains(r.RegisteredMethods, rq.Method); exists == true {
			ctxs, ok := (*r).Dispatchers[rq.Method]
			if ok != true {
				return GlobalError{
					code:             http.StatusNotFound,
					MessageForClient: "Not Found",
					innerError:       nil,
				}
			}

			// pass through filters
			if rq.Method != "OPTIONS" {
				for _, filter := range r.Filters {
					shouldBeFiltered, err := filter.Filter(w, rq)
					if shouldBeFiltered {
						if err == nil {
							w.WriteHeader(http.StatusUnauthorized)
							return GlobalError{
								code:             http.StatusUnauthorized,
								MessageForClient: "Not allowed to use this method",
								innerError:       nil,
							}
						}
						return GlobalError{
							code:             http.StatusInternalServerError,
							MessageForClient: "Server is temporarily unavailable. Please try later",
							innerError:       err,
						}
					}
				}
			}

			// Select the correct RouterContext based on (Registered Pattern, Request.URL.Path)
			path := rq.URL.Path
			ctx, found := findRightContextFromPath(ctxs, path)
			if found == false {
				return GlobalError{
					code:             http.StatusNotFound,
					MessageForClient: "Not Found",
					innerError:       nil,
				}
			}

			// Make Params by parsing
			params := parseURL(ctx.Pattern, path)
			result, err := ctx.Handler(w, rq, params)
			if err != nil {
				return GlobalError{
					code:             http.StatusInternalServerError,
					MessageForClient: "Server is temporarily unavailable. Please try later",
					innerError:       err,
				}
			}

			bytes, err := r.Marshaler.Marshal(result)
			if err != nil {
				return GlobalError{
					code:             http.StatusInternalServerError,
					MessageForClient: "",
					innerError:       err,
				}
			}
			w.WriteHeader(http.StatusOK)
			if bytes != nil {
				w.Write(bytes)
			}
			return nil
		}
		return GlobalError{
			code:             http.StatusMethodNotAllowed,
			MessageForClient: "Not Allowed Method",
		}
	}(w, rq)

	if globalError != nil {
		log.Printf("[Error] %v", fmt.Sprintf("%+v", globalError.(GlobalError).innerError))
		bytes, _ := r.Marshaler.Marshal(globalError)
		w.WriteHeader(globalError.(GlobalError).code)
		w.Write(bytes)
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

		// Should fix this line
		// First, check the length of the splitted (pattern, path)
		// Second, check if non-param word lay on the same position & same string value
		// If the two predicates passed, we can say that this is the target RouterContext
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
