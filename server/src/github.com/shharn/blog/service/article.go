package service

import (
	"encoding/json"

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
)

type getTheHottestArticlesPayload struct {
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
