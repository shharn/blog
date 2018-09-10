package handler

import (
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
)

const defaultNumberOfHottestArticles = "5"

// GetArticlesOnMenuHandler is for "GET /menus/:id/articles"
// Get all articles related to a menu by id
func GetArticlesOnMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	queryParams := rq.URL.Query()
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
func GetTheHottestArticlesHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	queryParams := rq.URL.Query()
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

// CreateArticleHandler is for "POST /articles"
func CreateArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	var (
		article data.Article
		err     error
	)
	if err = json.NewDecoder(rq.Body).Decode(&article); err != nil {
		return nil, errors.WithStack(err)
	}
	err = service.CreateArticle(article)
	return nil, err
}

// GetArticleHandler is for "GET /articles/:id"
func GetArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	id, exists := params["id"]
	if !exists {
		return nil, nil
	}
	if article, err := service.GetArticle(id.(string)); err != nil {
		return nil, err
	} else {
		return article, nil
	}
}

func UpdateArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	id, exists := params["id"]
	if !exists {
		return nil, nil
	}

	var article data.Article
	if err := json.NewDecoder(rq.Body).Decode(&article); err != nil {
		return nil, errors.WithStack(err)
	}

	if err := service.UpdateArticle(id.(string), article); err != nil {
		return nil, err
	}
	return nil, nil
}

// DeleteArticleHandler is for "DELETE /articles/:id"
func DeleteArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	id, exists := params["id"]
	if !exists {
		return nil, nil
	}

	if err := service.DeleteArticle(id.(string)); err != nil {
		return nil, err
	}
	return nil, nil
}
