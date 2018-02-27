package handler

import (
	"net/http"
	"fmt"
	// "puppyloper.blog/util"
)

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	cookie := r.Header.Get("Cookie")
	fmt.Println(cookie)
	// Storage
}
