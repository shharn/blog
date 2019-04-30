package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/pkg/errors"
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
)

const titleSep = "-"
const whiteSpace = " "
const defaultNumberOfHottestArticles = "5"

func sanitizeQueryParamOf(qps url.Values, key, defVal string) string {
	var sanitized string
	rawVals, exists := qps[key]
	if exists && len(rawVals) > 0 {
		sanitized = rawVals[0]
	} else {
		sanitized = defVal
	}
	return sanitized
}

// GetArticlesOnMenuHandler is for "GET /menus/:id/articles"
// Get all articles related to a menu by id
func GetArticlesOnMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	queryParams := rq.URL.Query()
	offset := sanitizeQueryParamOf(queryParams, "offset", "0")
	count := sanitizeQueryParamOf(queryParams, "count", defaultNumberOfHottestArticles)
	articles, err := service.GetArticlesOnMenu(params["id"].(string), offset, count)
	if err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to get articles", err)
	}
	return articles, router.EmptyErrorResponse
}

// GetTheHottestArticlesHandler is for "GET /articles/hottest
// Get the hottest articles
func GetTheHottestArticlesHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	queryParams := rq.URL.Query()
	offset := sanitizeQueryParamOf(queryParams, "offset", "0")
	count := sanitizeQueryParamOf(queryParams, "count", defaultNumberOfHottestArticles)
	articles, err := service.GetTheHottestArticles(offset, count)
	if err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to get the hottest articles", err)
	}
	return articles, router.EmptyErrorResponse
}

// CreateArticleHandler is for "POST /articles"
func CreateArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	var article model.Article
	if err := json.NewDecoder(rq.Body).Decode(&article); err != nil {
		err = errors.WithStack(err)
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to deserialize", err)
	}
	
	if err := service.CreateArticle(article); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to create an article", err)
	}
	return nil, router.EmptyErrorResponse
}

// GetArticleHandler is for "GET /articles/:id"
func GetArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	id, exists := params["id"]
	if !exists {
		return nil, router.NewErrorResponse(http.StatusBadRequest, "No id value found")
	}
	article, err := service.GetArticle(id.(string))
	if err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, fmt.Sprintf("Fail to get an article with id - %v", id), err)
	}
	return article, router.EmptyErrorResponse
}

func UpdateArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	id, exists := params["id"]
	if !exists {
		return nil, router.NewErrorResponse(http.StatusBadRequest, "No id value found")
	}

	var article model.Article
	if err := json.NewDecoder(rq.Body).Decode(&article); err != nil {
		err = errors.WithStack(err)
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to deserialize", err)
	}

	if err := service.UpdateArticle(id.(string), article); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, fmt.Sprintf("Fail to update an article with id - %v", id), err)
	}
	return nil, router.EmptyErrorResponse
}

// DeleteArticleHandler is for "DELETE /articles/:id"
func DeleteArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	id, exists := params["id"]
	if !exists {
		return nil, router.NewErrorResponse(http.StatusBadRequest, "No id value found")
	}

	if err := service.DeleteArticle(id.(string)); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, fmt.Sprintf("Fail to delete an article with id - %v", id), err)
	}
	return nil, router.EmptyErrorResponse
}


func GetArticleByTitleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	title, exists := params["title"]
	if !exists  || len(title.(string)) < 1{
		return nil, router.NewErrorResponse(http.StatusBadRequest, "No title value found")
	}

	article, err := service.GetArticleByTitle(title.(string))
	if err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, fmt.Sprintf("Fail to get an article with title - %v", title.(string)), err)
	}
	return article, router.EmptyErrorResponse
}
