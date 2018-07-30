package service

import (
	"encoding/json"
	"time"

	"github.com/pkg/errors"
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/db"
)

const (
	getTheHottestArticlesQuery = `
		query getTheHottestArticles($offset: int, $count: int) {
			articles (func: has(title), orderdesc: views, offset: $offset, first: $count){
				uid
				title
				content
				menu {
					uid
					name
				}
				imageSource
				summary
				createdAt
				views
			}
		}`
	getArticlesOnMenuQuery = `
		query getArticlesOnMenu($menuID: string, $offset: int, $count: int) {
			articles (func: has(title), orderdesc: createdAt, offset: $offset, first: $count) @filter(uid_in(menu, $menuID)) {
				uid
				title
				content
				menu {
					uid
					name
				}
				imageSource
				summary
				createdAt
				views
			}
		}`
)

type getTheHottestArticlesPayload struct {
	Articles []data.Article `json:"articles"`
}

type getArticlesOnMenusPayload struct {
	Articles []data.Article `json:"articles"`
}

// GetTheHottestArticles is a service for "GET /articles/hottest"
func GetTheHottestArticles(offset, numOfArticles string) (interface{}, error) {
	c, err := db.Init()
	defer c.CleanUp()
	if err != nil {
		return nil, errors.WithStack(err)
	}

	vars := map[string]string{
		"$offset": offset,
		"$count":  numOfArticles,
	}
	res, err := c.QueryWithVars(getTheHottestArticlesQuery, vars)
	defer c.Commit()
	if err != nil {
		return nil, errors.WithStack(err)
	}
	articles := getTheHottestArticlesPayload{}
	if err := json.Unmarshal(res.Json, &articles); err != nil {
		return nil, errors.WithStack(err)
	}
	return articles.Articles, nil
}

// GetArticlesOnMenu returns articles belong to the menu
func GetArticlesOnMenu(menuID, offset, count string) (interface{}, error) {
	c, err := db.Init()
	defer c.CleanUp()
	if err != nil {
		return nil, errors.WithStack(err)
	}
	defer c.Commit()

	vars := map[string]string{
		"$menuID": menuID,
		"$offset": offset,
		"$count":  count,
	}

	res, err := c.QueryWithVars(getArticlesOnMenuQuery, vars)

	if err != nil {
		return nil, errors.WithStack(err)
	}
	articles := getArticlesOnMenusPayload{}
	if err := json.Unmarshal(res.Json, &articles); err != nil {
		return nil, errors.WithStack(err)
	}
	return articles.Articles, nil
}

// CreateArticle creates a new article
func CreateArticle(article data.Article) error {
	var c *db.Client
	var err error
	c, err = db.Init()
	defer c.CleanUp()
	if err != nil {
		return err
	}
	defer c.Commit()

	article.CreatedAt = time.Now().Format(time.RFC3339)
	md := db.MutationData{article}
	_, err = c.Mutate(md)
	if err != nil {
		return err
	}
	return nil
}
