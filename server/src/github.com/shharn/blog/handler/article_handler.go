package handler

import (
	"net/http"
	"net/url"

	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
)

const defaultNumberOfHottestArticles = "5"

// GetArticlesOnMenuHandler is for "GET /menus/:id/articles"
// Get all articles related to a menu by id
func GetArticlesOnMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params, queryParams url.Values) (interface{}, error) {
	var realOffset, realCount string
	rawOffset, exists := queryParams["offset"]
	if exists {
		realOffset = rawOffset[0]
	} else {
		realOffset = "0"
	}

	rawCount, exists := queryParams["count"]
	if exists {
		realCount = rawCount[0]
	} else {
		realCount = defaultNumberOfHottestArticles
	}
	articles, err := service.GetArticlesOnMenu(params["id"].(string), realOffset, realCount)
	return articles, err
}

// GetTheHottestArticlesHandler is for "GET /articles/hottest
// Get the hottest articles
func GetTheHottestArticlesHandler(w http.ResponseWriter, rq *http.Request, params router.Params, queryParams url.Values) (interface{}, error) {
	var realOffset, realCount string
	rawOffset, exists := queryParams["offset"]
	if exists {
		realOffset = rawOffset[0]
	} else {
		realOffset = "0"
	}

	rawCount, exists := queryParams["count"]
	if exists {
		realCount = rawCount[0]
	} else {
		realCount = defaultNumberOfHottestArticles
	}

	articles, err := service.GetTheHottestArticles(realOffset, realCount)
	if err != nil {
		return nil, err
	}
	return articles, nil
}
