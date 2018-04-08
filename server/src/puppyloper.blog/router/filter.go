package router

import "net/http"

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
