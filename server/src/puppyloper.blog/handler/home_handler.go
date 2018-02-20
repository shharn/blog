package handler

import (
	"net/http"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(202)
}