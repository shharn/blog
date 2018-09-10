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
			}
		}`
	getArticleQuery = `
		query getArticle($articleID: string) {
			articles (func: uid($articleID)) {
				uid
				title
				content
				summary
				imageSource
				createdAt
				menu {
					uid
					name
				}
			}
		}
	`
	getMenuToWhichTheArticleBelongQuery = `
		query getMenuToWhichTheArticleBelongQuery($articleID: string) {
			articles (func: uid($articleID)) {
				menu {
					uid
				}
				createdAt
			}
		}
	`
)

type getTheHottestArticlesPayload struct {
	Articles []data.Article `json:"articles"`
}

type getArticlesOnMenusPayload struct {
	Articles []data.Article `json:"articles"`
}

type getArticlePayload struct {
	Articles []data.Article `json:"articles"`
}

type getMenuToWhichTheArticleBelongPayload struct {
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

// GetArticle will give you a article which has the id
func GetArticle(id string) (interface{}, error) {
	c, err := db.Init()
	defer c.CleanUp()
	if err != nil {
		return nil, errors.WithStack(err)
	}
	defer c.Commit()

	vars := map[string]string{"$articleID": id}
	res, err := c.QueryWithVars(getArticleQuery, vars)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	articles := getArticlePayload{}
	if err := json.Unmarshal(res.Json, &articles); err != nil {
		return nil, errors.WithStack(err)
	}

	if len(articles.Articles) > 0 {
		return articles.Articles[0], nil
	}
	return nil, nil
}

// DeleteArticle removes an article node with uid
func DeleteArticle(id string) error {
	var (
		err error
		c   *db.Client
	)
	c, err = db.Init()
	defer c.CleanUp()
	if err != nil {
		return errors.WithStack(err)
	}

	_, err = c.DeleteNode(id)
	defer c.Commit()
	if err != nil {
		return errors.WithStack(err)
	}
	return nil
}

// UpdateArticle updates an article
func UpdateArticle(id string, article data.Article) error {
	var (
		err error
		c   *db.Client
	)
	c, err = db.Init()
	defer c.CleanUp()
	if err != nil {
		return errors.WithStack(err)
	}
	defer c.Commit()

	// if parent menu is changed, delete old edge
	vars := map[string]string{"$articleID": id}
	res, err2 := c.QueryWithVars(getMenuToWhichTheArticleBelongQuery, vars)
	if err2 != nil {
		return err2
	}
	oldArticle := getMenuToWhichTheArticleBelongPayload{}
	if err = json.Unmarshal(res.Json, &oldArticle); err != nil {
		return errors.WithStack(err)
	}

	oldMenu := oldArticle.Articles[0].Menu
	if (*oldMenu)[0].ID != (*article.Menu)[0].ID {
		_, err = c.DeleteEdge(article.ID, "menu", (*oldMenu)[0].ID)
		if err != nil {
			return err
		}
	}

	article.CreatedAt = oldArticle.Articles[0].CreatedAt
	mmd := db.MutationData{article}
	_, err3 := c.Mutate(mmd)
	if err3 != nil {
		return errors.WithStack(err3)
	}
	return nil
}
