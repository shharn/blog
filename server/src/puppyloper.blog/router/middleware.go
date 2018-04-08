package router

import "net/http"

// MiddlewareError is thrown by the Filter
type MiddlewareError struct {
	Code int
}

// Errors is
func (f MiddlewareError) Errors() string {
	return string(f.Code)
}

// Middleware filters or pre-processes the request
// Can be used for authentication or something like that
type Middleware func(w http.ResponseWriter, r *http.Request) Middleware
