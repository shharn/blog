package service

import (
	"encoding/json"
	"strconv"

	"github.com/pkg/errors"
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/db"
)

const (
	getTheHottestArticlesQuery = `
		query getTheHottestArticles($count: int) {
			articles (func: has(title), orderdesc: views, first: $count){
				uid
				title
				content
				menu {
					uid
				}
				imageSource
				summary
				views
			}
		}`
)

type getTheHottestArticlesPayload struct {
	Articles []data.Article `json:"articles"`
}

// GetTheHottestArticles is a service for "GET /articles/hottest"
func GetTheHottestArticles(numOfArticles int) (interface{}, error) {
	c, err := db.Init()
	defer c.CleanUp()
	if err != nil {
		return nil, errors.WithStack(err)
	}

	vars := map[string]string{
		"$count": strconv.Itoa(numOfArticles),
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
