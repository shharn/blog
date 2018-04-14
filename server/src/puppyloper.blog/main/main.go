package main

import (
	"net/http"

	"puppyloper.blog/config"
	"puppyloper.blog/handler"
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
	r.SetAllowedOrigin("*").
		SetAllowedMethod("GET, POST, DELETE, OPTIONS, PUT, PATCH").
		SetAllowedHeaders("Access-Control-Request-Headers,Access-Control-Request-Headers, Access-Control-Request-Method, Origin, Content-Type, Accept").
		SetCORS()
	r.Use(router.AuthFilter{Key: config.JWTSecretKey})

	r.Post("/login", handler.LoginHandler)
	r.Get("/menus", handler.GetMenusHandler)
	r.Post("/menus", handler.CreateMenuHandler)
	r.Patch("/menus", handler.UpdateMenuHandler)
	r.Delete("/menus/:id", handler.DeleteMenuHandler)
	http.ListenAndServe(":10000", r)
}
