package handler

import (
	"fmt"
	"net/http"
)

// LogoutHandler is the service for "POST /logout"
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	cookie := r.Header.Get("Cookie")
	fmt.Println(cookie)
	// Storage
}
