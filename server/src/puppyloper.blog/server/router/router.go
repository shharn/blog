package router

import "net/http"

// Filter filters or pre-processes the request
// Can be used for handling CORS, Authentication and something like that
type Filter func(w http.ResponseWriter, r *http.Request) error

// Filters is array of Filter
type Filters []Filter

// Handler processes the client's request and return something
// The argument will be the unmarshalled body & route parameter values & values in Query String
// the object of return value({}interface) will be processed by PostFilter
type Handler func(body interface{}, params ...interface{}) (interface{}, error)

// PostFilter processes the result of the Handler.
// I'll place the JSON Marshaller on it
type PostFilter func(result interface{}) ([]byte, error)

// PostFilters is array of PostFilter
type PostFilters []PostFilter

// RouterContext includes the information for the routing
type RouterContext struct {
	Path        string
	Filters     Filters
	Handler     Handler
	PostFilters PostFilters
}

// Router is router - self-explanatory
type Router map[string]RouterContext

// Get registers the handler, filters, post-filters for the path
func (router Router) Get(path string, handler Handler, filters Filters, postFilters PostFilters) {

}

// Post registers the handler, filters, post-filters for the path
func (router Router) Post(path string, handler Handler, filters Filters, postFilters PostFilters) {

}

// Patch registers the handler, filters, post-filters for the path
func (router Router) Patch(path string, handler Handler, filters Filters, postFilters PostFilters) {

}

// Put registers the handler, filters, post-filters for the path
func (router Router) Put(path string, handler Handler, filters Filters, postFilters PostFilters) {

}

// Delete registers the handler, filters, post-filters for the path
func (router Router) Delete(path string, handler Handler, filters Filters, postFilters PostFilters) {

}
