package main

import (
	"net/http"

	"github.com/pkg/errors"
	"github.com/shharn/blog/handler"
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/session"
)

var (
	allowedOrigin = []string{ "http://blog.puppyloper.com", "https://blog.puppyloper.com" }
	allowedMethods = "GET, POST, DELETE, OPTIONS, PATCH"
	allowedHeaders = "Access-Control-Request-Headers,Access-Control-Request-Headers, Access-Control-Request-Method, Origin, Content-Type, Accept, X-Session-Token"
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

	r.Post("/login", handler.LoginHandler)
	r.Post("/oauth/authorizations/:platform", handler.OAuthAuthorizationHandler)
	r.Get("/oauth/authorizations/:platform/codes/:code", handler.OAuthCodeExchangeHandler)
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
	r.Get("/articles/titles/:title", handler.GetArticleByTitleHandler)
	r.Patch("/articles/:id", handler.UpdateArticleHandler)
	r.Delete("/articles/:id", handler.DeleteArticleHandler)

	if err := http.ListenAndServe(":5000", r); err != nil {
		logger.Fatal(errors.WithStack(err))
	} else {
		logger.Info("Listening on port 5000")
	}
}
