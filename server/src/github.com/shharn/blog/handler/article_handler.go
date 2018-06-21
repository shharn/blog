package handler

import (
	"log"
	"net/http"

	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
)

const defaultNumberOfHottestArticles = 5

// GetArticlesOnMenuHandler is for "GET /menus/:id/articles"
// Get all articles related to a menu by id
func GetArticlesOnMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	log.Printf("[GetArticlesOnMenuHandler] Params : %v\n", params)
	return nil, nil
}

// GetTheHottestArticlesHandler is for "GET /articles/hottest
// Get the hottest articles
func GetTheHottestArticlesHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	log.Printf("[GetTheHottestArticles] Params : %v\n", params)
	articles, err := service.GetTheHottestArticles(defaultNumberOfHottestArticles)
	if err != nil {
		return nil, err
	}
	return articles, nil
}
