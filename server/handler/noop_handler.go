package handler

import (
	"net/http"

	"github.com/shharn/blog/router"
)

// NoopHandler is for load balancer which DOES health check on this root URL
func NoopHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	return nil, router.EmptyErrorResponse
}