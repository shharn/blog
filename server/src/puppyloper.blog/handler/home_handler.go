package handler

import (
	"net/http"
)

// HomeHandler is the service for "GET /"
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(202)
}
