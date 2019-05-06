package repository

import (
	"encoding/json"

	"github.com/pkg/errors"
	"github.com/shharn/blog/db"
	"github.com/shharn/blog/model"
)

type ArticleRepository interface {
	HottestArticles(interface{}, string, string) ([]model.Article, error)
	ArticlesOnMenu(interface{}, string, string, string) ([]model.Article, error)
	Create(interface{}, model.Article) error
	Get(interface{}, string) (model.Article, error)
	Delete(interface{}, string) error
	Update(interface{}, model.Article) error
	GetByTitle(interface{}, string) (model.Article, error)
	Contextual
}

const (
	getTheHottestArticlesQuery = `
		query getTheHottestArticles($offset: int, $count: int) {
			articles (func: has(title), orderdesc: createdAt, orderdesc: views, offset: $offset, first: $count){
				uid
				title
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
				views
			}
		}
	`
	getArticleByTitleQuery = `
		query getArticleByTitle($title: string) {
			articles (func: eq(title, $title)) {
				uid,
				title,
				content,
				summary,
				imageSource,
				createdAt
				menu {
					uid
					name
				}
				views
			}
		}
	`
)

type getTheHottestArticlesPayload struct {
	Articles []model.Article `json:"articles"`
}

type getArticlesOnMenusPayload struct {
	Articles []model.Article `json:"articles"`
}

type getArticlePayload struct {
	Articles []model.Article `json:"articles"`
}

type DgraphArticleRepository struct {}

func (r *DgraphArticleRepository) Context() interface{} {
	c, err := db.Init()
	if err != nil {
		panic(err)
	}
	return &dgraphRepositoryContext{c, nil}
}

func (r *DgraphArticleRepository) HottestArticles(ctx interface{}, offset, count string) ([]model.Article, error) {
	rctx := ctx.(*dgraphRepositoryContext)
	vars := map[string]string{
		"$offset": offset,
		"$count":  count,
	}
	res, err := rctx.Client.QueryWithVars(getTheHottestArticlesQuery, vars)
	
	if err != nil {
		rctx.Err = err
		return nil, errors.WithStack(err)
	}
	articles := getTheHottestArticlesPayload{}
	if err := json.Unmarshal(res.Json, &articles); err != nil {
		rctx.Err = err
		return nil, errors.WithStack(err)
	}
	return articles.Articles, nil
}

func (r *DgraphArticleRepository) ArticlesOnMenu(ctx interface{}, mid, offset, count string) ([]model.Article, error) {
	rctx := ctx.(*dgraphRepositoryContext)
	vars := map[string]string{
		"$menuID": mid,
		"$offset": offset,
		"$count":  count,
	}

	res, err := rctx.Client.QueryWithVars(getArticlesOnMenuQuery, vars)
	if err != nil {
		rctx.Err = err
		return nil, errors.WithStack(err)
	}
	articles := getArticlesOnMenusPayload{}
	if err := json.Unmarshal(res.Json, &articles); err != nil {
		rctx.Err = err
		return nil, errors.WithStack(err)
	}
	return articles.Articles, nil
}

func (r *DgraphArticleRepository) Create(ctx interface{}, article model.Article) error {
	rctx := ctx.(*dgraphRepositoryContext)
	md := db.MutationData{article}
	if _, err := rctx.Client.Mutate(md); err != nil {
		rctx.Err = err
		return err
	}
	return nil
}

func (r *DgraphArticleRepository) Get(ctx interface{}, id string) (model.Article, error) {
	rctx := ctx.(*dgraphRepositoryContext)
	vars := map[string]string{"$articleID": id}
	res, err := rctx.Client.QueryWithVars(getArticleQuery, vars)
	if err != nil {
		rctx.Err = err
		return model.EmptyArticle, errors.WithStack(err)
	}
	raw := getArticlePayload{}
	if err := json.Unmarshal(res.Json, &raw); err != nil {
		rctx.Err = err
		return model.EmptyArticle, errors.WithStack(err)
	}

	if len(raw.Articles) < 1 {
		return model.EmptyArticle, nil
	}
	
	article := raw.Articles[0]
	return article, nil
}

func (r *DgraphArticleRepository) Delete(ctx interface{}, id string) error {
	rctx := ctx.(*dgraphRepositoryContext)
	_, err := rctx.Client.DeleteNode(id)
	if err != nil {
		rctx.Err = err
		return errors.WithStack(err)
	}
	return nil
}

func (r *DgraphArticleRepository) Update(ctx interface{}, article model.Article) error {
	rctx := ctx.(*dgraphRepositoryContext)
	oldArticle, err := r.Get(ctx, article.ID)
	if err != nil {
		rctx.Err = err
		return err
	}

	oldMenus := oldArticle.Menu
	if len((*oldMenus)) > 0 {
		oldMenu := (*oldMenus)[0]
		if oldMenu.ID != (*article.Menu)[0].ID {
			if _, err := rctx.Client.DeleteEdge(article.ID, "menu", oldMenu.ID); err != nil {
				rctx.Err = err
				return err
			}
		}
	}

	article.CreatedAt = oldArticle.CreatedAt
	mmd := db.MutationData{article}
	if _, err := rctx.Client.Mutate(mmd); err != nil {
		rctx.Err = err
		return err
	}
	return nil
}

func (r *DgraphArticleRepository) GetByTitle(ctx interface{}, title string) (model.Article, error) {
	rctx := ctx.(*dgraphRepositoryContext)
	vars := map[string]string{"$title": title}
	res, err := rctx.Client.QueryWithVars(getArticleByTitleQuery, vars)
	if err != nil {
		rctx.Err = err
		return model.EmptyArticle, err
	}

	raw := getArticlePayload{}
	if err := json.Unmarshal(res.Json, &raw); err != nil {
		rctx.Err = err
		return model.EmptyArticle, errors.WithStack(err)
	}

	if len(raw.Articles) < 0 {
		return model.EmptyArticle, nil
	}
	return raw.Articles[0], nil
}

func NewArticleRepository() ArticleRepository {
	return &DgraphArticleRepository{}
}
