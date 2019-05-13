package main

import (
	"net/http"

	"github.com/pkg/errors"
	"github.com/shharn/blog/handler"
	"github.com/shharn/blog/service"
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/repository"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/session"
)

var (
	allowedOrigin = []string{ "http://blog.puppyloper.com", "https://blog.puppyloper.com" }
	allowedMethods = "GET, POST, DELETE, OPTIONS, PATCH"
	allowedHeaders = "Access-Control-Request-Headers,Access-Control-Request-Headers, Access-Control-Request-Method, Origin, Content-Type, Accept, X-Session-Token"

	sessionStorage = session.BlogSessionStorage()
	tokenMaker = session.BlogTokenMaker()
)

func getSession(rq *http.Request) *session.Session {
	token := rq.Header.Get(handler.TokenName)
	if len(token) < 1 {
		return nil
	}

	s, err := tokenMaker.Decode(token)
	if err != nil {
		return nil
	}
	return s.(*session.Session)
}

func checkIfAdmin(session *session.Session) bool {
	if session == nil {
		return false
	}
	return session.Admin
}

func sessionExtractorWrapper(fn func(*session.Session)bool) func(http.ResponseWriter, *http.Request)bool {
	return func(w http.ResponseWriter, rq *http.Request) bool {
		session := getSession(rq)
		return fn(session)
	}
}

func main() {
	r := router.NewRouter(router.JSONMarshaler{})
	r.SetCORS().
		SetAllowedOrigin(allowedOrigin).
		SetAllowedMethod(allowedMethods).
		SetAllowedHeaders(allowedHeaders)
	r.Use(LogFilter{})
	r.Use(AuthFilter{
		TargetContexts: []*TargetContext {
			0: &TargetContext{"/menus", "POST", sessionExtractorWrapper(checkIfAdmin)},
			1: &TargetContext{"/menus/:id", "PATCH", sessionExtractorWrapper(checkIfAdmin)},
			2: &TargetContext{"/menus/:id", "DELETE", sessionExtractorWrapper(checkIfAdmin)},
			3: &TargetContext{"/articles", "POST", sessionExtractorWrapper(checkIfAdmin)},
			4: &TargetContext{"/articles/:id", "PATCH", sessionExtractorWrapper(checkIfAdmin)},
			5: &TargetContext{"/articles/:id", "DELETE", sessionExtractorWrapper(checkIfAdmin)},
		},
	})
	
	r.Get("/", handler.NoopHandler)

	authenticationService := service.NewAuthenticationService(repository.NewAuthenticationRepository(), sessionStorage, tokenMaker)
	authenticationHandler := handler.NewAuthenticationHandler(authenticationService)
	r.Post("/login", authenticationHandler.LoginHandler)
	r.Post("/oauth/authorizations/:platform", authenticationHandler.OAuthAuthorizationHandler)
	r.Get("/oauth/authorizations/:platform/codes/:code", authenticationHandler.OAuthCodeExchangeHandler)
	r.Post("/logout", authenticationHandler.LogoutHandler)
	r.Get("/check", authenticationHandler.CheckHandler)

	menuService := service.NewMenuService(repository.NewMenuRepository())
	menuHandler := handler.NewMenuHandler(menuService)
	r.Get("/menus", menuHandler.GetMenusHandler)
	r.Post("/menus", menuHandler.CreateMenuHandler)
	r.Patch("/menus/:id", menuHandler.UpdateMenuHandler)
	r.Delete("/menus/:id", menuHandler.DeleteMenuHandler)

	articleService := service.NewArticleService(repository.NewArticleRepository())
	articleHandler := handler.NewArticleHandler(articleService)
	r.Get("/articles/hottest", articleHandler.GetTheHottestArticlesHandler)
	r.Post("/articles", articleHandler.CreateArticleHandler)
	r.Get("/articles/:id", articleHandler.GetArticleHandler)
	r.Get("/articles/titles/:title", articleHandler.GetArticleByTitleHandler)
	r.Patch("/articles/:id", articleHandler.UpdateArticleHandler)
	r.Delete("/articles/:id", articleHandler.DeleteArticleHandler)
	r.Get("/menus/:id/articles", articleHandler.GetArticlesOnMenuHandler)

	if err := http.ListenAndServe(":5000", r); err != nil {
		logger.Fatal(errors.WithStack(err))
	} else {
		logger.Info("Listening on port 5000")
	}
}
