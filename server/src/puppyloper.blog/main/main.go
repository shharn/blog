package main

import (
	"net/http"

	"puppyloper.blog/handler"
	"puppyloper.blog/middleware"
	"puppyloper.blog/router"
)

// GetMenusHandler for test
func GetMenusHandler(http.ResponseWriter, *http.Request, router.Params) (interface{}, error) {
	return nil, nil
}

// LoginHandler for test
func LoginHandler(http.ResponseWriter, *http.Request, router.Params) (interface{}, error) {
	return true, nil
}

func main() {
	r := router.NewRouter()
	r.Get("/menus", GetMenusHandler, nil, nil)
	r.Post("/login", LoginHandler, nil, nil)
	// router.Get("/menus", GetMenusHandler, [Filters], handler)
	// SetCors set the 'EnableCors' flag & prepare the handler for "OPTIONS" method with the configs the below SetXXX method
	// router.SetCors().
	// router.SetAllowedOrigin("localhost:3000")
	// router.SetAllowedMethod("GET, DELETE, ... ")
	// router.SetAllowedHeaders("Access-Control-Request-Headers, Access-Control-Request-Method, ...")

	http.HandleFunc("/", handler.HomeHandler)
	http.HandleFunc("/login", middleware.CorsMiddleware(handler.LoginHandler))
	http.HandleFunc("/check", middleware.CorsMiddleware(handler.CheckHandler))
	http.HandleFunc("/logout", middleware.CorsMiddleware(handler.LogoutHandler))
	http.HandleFunc("/menus", middleware.CorsMiddleware(middleware.AuthMiddleware(handler.MenuHandler)))
	http.ListenAndServe(":10000", nil)
}
