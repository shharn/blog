package main

import (
	"net/http"
	"puppyloper.blog/handler"
	"puppyloper.blog/middleware"
)

func main() {
	http.HandleFunc("/", handler.HomeHandler)
	http.HandleFunc("/login", middleware.CorsMiddleware(handler.LoginHandler))
	http.HandleFunc("/menus", middleware.CorsMiddleware(handler.MenuHandler))
	http.ListenAndServe(":10000", nil)
}
