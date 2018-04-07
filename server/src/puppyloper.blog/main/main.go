package main

import (
	"net/http"

	"puppyloper.blog/handler"
	"puppyloper.blog/middleware"
)

func main() {
	//router := simplerouter.New()
	// router.Get("/menus", GetMenusHandler, [AuthMiddleware])
	// SetCors set the 'EnableCors' flag & prepare the handler for "OPTIONS" method with the configs the below SetXXX method
	// router.SetCors().SetAllowedOrigin("{domain}")
	// router.SetAllowedMethod("GET, DELETE, ... ")
	// router.SetAllowedHeaders("Access-Control-Request-Headers, Access-Control-Request-Method, ...")

	http.HandleFunc("/", handler.HomeHandler)
	http.HandleFunc("/login", middleware.CorsMiddleware(handler.LoginHandler))
	http.HandleFunc("/check", middleware.CorsMiddleware(handler.CheckHandler))
	http.HandleFunc("/logout", middleware.CorsMiddleware(handler.LogoutHandler))
	http.HandleFunc("/menus", middleware.CorsMiddleware(middleware.AuthMiddleware(handler.MenuHandler)))
	http.ListenAndServe(":10000", nil)
}
