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
	//r := router.NewRouter()
	// r.SetCORS()
	// 	.SetAllowedOrigin("localhost:3000")
	// 	.SetAllowedMethod("GET, POST, DELETE, OPTIONS, PUT, PATCH")
	// 	.SetAllowedHeaders("Access-Control-Request-Headers", "Access-Control-Request-Headers, Access-Control-Request-Method, Origin, Content-Type, Accept")
	// r.Use(middleware.AuthMiddleware)
	// r.Get("/menus", GetMenusHandler)
	// r.Post("/login", LoginHandler)

	http.HandleFunc("/", handler.HomeHandler)
	http.HandleFunc("/login", middleware.CorsMiddleware(handler.LoginHandler))
	http.HandleFunc("/check", middleware.CorsMiddleware(handler.CheckHandler))
	http.HandleFunc("/logout", middleware.CorsMiddleware(handler.LogoutHandler))
	http.HandleFunc("/menus", middleware.CorsMiddleware(middleware.AuthMiddleware(handler.MenuHandler)))
	http.ListenAndServe(":10000", nil)
}
