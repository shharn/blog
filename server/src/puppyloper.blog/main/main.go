package main

import (
	"fmt"
	"net/http"
	"strconv"

	"puppyloper.blog/data"
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

// DeleteMenuHandler for test
func DeleteMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	fmt.Printf("[DeleteMenuHandler] Length of Params : %v, Params: %v\n", len(params), params)
	id, _ := strconv.Atoi(params["id"].(string))
	return data.Menu{
		ID:       id,
		Name:     "Test Menu",
		ParentID: -1,
		URL:      "/",
	}, nil
}

func main() {
	r := router.NewRouter()
	r.SetAllowedOrigin("localhost:3000").
		SetAllowedMethod("GET, POST, DELETE, OPTIONS, PUT, PATCH").
		SetAllowedHeaders("Access-Control-Request-Headers,Access-Control-Request-Headers, Access-Control-Request-Method, Origin, Content-Type, Accept").
		SetCORS()
	r.Use(router.AuthFilter{Key: "secret"})
	r.Get("/menus", GetMenusHandler)
	r.Delete("/menus/:id", DeleteMenuHandler)
	r.Post("/login", LoginHandler)
	http.ListenAndServe(":10000", r)

	// http.HandleFunc("/", handler.HomeHandler)
	// http.HandleFunc("/login", middleware.CorsMiddleware(handler.LoginHandler))
	// http.HandleFunc("/check", middleware.CorsMiddleware(handler.CheckHandler))
	// http.HandleFunc("/logout", middleware.CorsMiddleware(handler.LogoutHandler))
	// http.HandleFunc("/menus", middleware.CorsMiddleware(middleware.AuthMiddleware(handler.MenuHandler)))
	// http.ListenAndServe(":10000", nil)
}
