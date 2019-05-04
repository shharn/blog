package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/pkg/errors"
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/service"
	"github.com/shharn/blog/router"
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

type ArticleHandler struct {
	articleService service.ArticleService
}

// GetArticlesOnMenuHandler is for "GET /menus/:id/articles"
// Get all articles related to a menu by id
func (h *ArticleHandler) GetArticlesOnMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	queryParams := rq.URL.Query()
	offset := sanitizeQueryParamOf(queryParams, "offset", "0")
	count := sanitizeQueryParamOf(queryParams, "count", defaultNumberOfHottestArticles)
	articles := h.articleService.GetArticlesOnMenu(params["id"].(string), offset, count)
	return articles, router.EmptyErrorResponse
}

// GetTheHottestArticlesHandler is for "GET /articles/hottest
// Get the hottest articles
func (h *ArticleHandler) GetTheHottestArticlesHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	queryParams := rq.URL.Query()
	offset := sanitizeQueryParamOf(queryParams, "offset", "0")
	count := sanitizeQueryParamOf(queryParams, "count", defaultNumberOfHottestArticles)
	articles := h.articleService.GetTheHottestArticles(offset, count)
	return articles, router.EmptyErrorResponse
}

// CreateArticleHandler is for "POST /articles"
func (h *ArticleHandler) CreateArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	var article model.Article
	if err := json.NewDecoder(rq.Body).Decode(&article); err != nil {
		err = errors.WithStack(err)
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to deserialize", err)
	}
	
	if err := h.articleService.CreateArticle(article); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to create an article", err)
	}
	return nil, router.EmptyErrorResponse
}

// GetArticleHandler is for "GET /articles/:id"
func (h *ArticleHandler) GetArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	id, exists := params["id"]
	if !exists {
		return nil, router.NewErrorResponse(http.StatusBadRequest, "No id value found")
	}
	article := h.articleService.GetArticle(id.(string))
	return article, router.EmptyErrorResponse
}

func (h *ArticleHandler) UpdateArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	id, exists := params["id"]
	if !exists {
		return nil, router.NewErrorResponse(http.StatusBadRequest, "No id value found")
	}

	var article model.Article
	if err := json.NewDecoder(rq.Body).Decode(&article); err != nil {
		err = errors.WithStack(err)
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to deserialize", err)
	}

	article.ID = id.(string)
	if err := h.articleService.UpdateArticle(article); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, fmt.Sprintf("Fail to update an article with id - %v", id), err)
	}
	return nil, router.EmptyErrorResponse
}

// DeleteArticleHandler is for "DELETE /articles/:id"
func (h *ArticleHandler) DeleteArticleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	id, exists := params["id"]
	if !exists {
		return nil, router.NewErrorResponse(http.StatusBadRequest, "No id value found")
	}

	if err := h.articleService.DeleteArticle(id.(string)); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, fmt.Sprintf("Fail to delete an article with id - %v", id), err)
	}
	return nil, router.EmptyErrorResponse
}


func (h *ArticleHandler) GetArticleByTitleHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	title, exists := params["title"]
	if !exists  || len(title.(string)) < 1{
		return nil, router.NewErrorResponse(http.StatusBadRequest, "No title value found")
	}

	article := h.articleService.GetArticleByTitle(title.(string))
	return article, router.EmptyErrorResponse
}

func NewArticleHandler(s service.ArticleService) *ArticleHandler {
	return &ArticleHandler{s}
}