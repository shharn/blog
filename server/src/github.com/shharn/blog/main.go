package main

import (
	"net/http"
	"log"

	"github.com/shharn/blog/config"
	"github.com/shharn/blog/handler"
	"github.com/shharn/blog/router"
)

var (
	allowedOrigin = []string{ "puppyloper.blog" }
	allowedMethods = "GET, POST, DELETE, OPTIONS, PATCH"
	allowedHeaders = "Access-Control-Request-Headers,Access-Control-Request-Headers, Access-Control-Request-Method, Origin, Content-Type, Accept, X-Session-Token"
)

func main() {
	r := router.NewRouter()
	r.SetAllowedOrigin(allowedOrigin).
		SetAllowedMethod(allowedMethods).
		SetAllowedHeaders(allowedHeaders).
		SetCORS()
	r.Use(router.AuthFilter{Key: config.Key})

	// for load balancer
	r.Get("/", handler.NoopHandler)

	r.Post("/login", handler.LoginHandler)
	r.Post("/logout", handler.LogoutHandler)
	r.Get("/check", handler.CheckHandler)

	r.Get("/menus", handler.GetMenusHandler)
	r.Post("/menus", handler.CreateMenuHandler)
	r.Patch("/menus/:id", handler.UpdateMenuHandler)
	r.Delete("/menus/:id", handler.DeleteMenuHandler)

	r.Get("/menus/:id/articles", handler.GetArticlesOnMenuHandler)
	r.Get("/articles/hottest", handler.GetTheHottestArticlesHandler)
	r.Post("/articles", handler.CreateArticleHandler)
	r.Get("/articles/:id", handler.GetArticleHandler)
	r.Patch("/articles/:id", handler.UpdateArticleHandler)
	r.Delete("/articles/:id", handler.DeleteArticleHandler)

	if err := handler.RegenerateKey(); err == nil {
		if err := http.ListenAndServe(":5000", r); err != nil {
			log.Printf("%+v\n", err)
		} else {
			log.Println("Listening on port 80\v")
		}
	} else {
		log.Printf("%+v\n", err)
	}
}
