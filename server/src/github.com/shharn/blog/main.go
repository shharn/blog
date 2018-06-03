package main

import (
	"net/http"

	"github.com/shharn/blog/config"
	"github.com/shharn/blog/handler"
	"github.com/shharn/blog/router"
)

const (
	allowedOrigin  = "*"
	allowedMethods = "GET, POST, DELETE, OPTIONS, PUT, PATCH"
	allowedHeaders = "Access-Control-Request-Headers,Access-Control-Request-Headers, Access-Control-Request-Method, Origin, Content-Type, Accept, X-Session-Token"
)

func main() {
	r := router.NewRouter()
	r.SetAllowedOrigin(allowedOrigin).
		SetAllowedMethod(allowedMethods).
		SetAllowedHeaders(allowedHeaders).
		SetCORS()
	r.Use(router.AuthFilter{Key: config.JWTSecretKey})

	r.Post("/login", handler.LoginHandler)

	r.Get("/check", handler.CheckHandler)

	r.Get("/menus", handler.GetMenusHandler)
	r.Post("/menus", handler.CreateMenuHandler)
	r.Patch("/menus", handler.UpdateMenuHandler)
	r.Delete("/menus/:id", handler.DeleteMenuHandler)

	http.ListenAndServe(":10000", r)
}