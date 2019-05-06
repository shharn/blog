package mock

import (
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/repository"
	"github.com/stretchr/testify/mock"
)

type MockArticleRepository struct {
	mock.Mock
}

func (mr *MockArticleRepository) Context() interface{} {
	ret := mr.Called()
	return ret.Get(0).(repository.Disposable)
}

func (mr *MockArticleRepository)  HottestArticles(ctx interface{}, offset, count string) ([]model.Article, error) {
	ret := mr.Called(ctx, offset, count)
	return ret.Get(0).([]model.Article), ret.Error(1)
}

func (mr *MockArticleRepository) ArticlesOnMenu(ctx interface{}, mid, offset, count string) ([]model.Article, error) {
	ret := mr.Called(ctx, mid, offset, count)
	return ret.Get(0).([]model.Article), ret.Error(1)
}

func (mr *MockArticleRepository) Create(ctx interface{}, article model.Article) error {
	ret := mr.Called(ctx, article)
	return ret.Error(0)
}

func (mr *MockArticleRepository) Get(ctx interface{}, id string) (model.Article, error) {
	ret := mr.Called(ctx, id)
	return ret.Get(0).(model.Article), ret.Error(1)
}

func (mr *MockArticleRepository) Delete(ctx interface{}, id string) error {
	ret:= mr.Called(ctx, id)
	return ret.Error(0)
}

func (mr *MockArticleRepository) Update(ctx interface{}, article model.Article) error {
	ret := mr.Called(ctx, article)
	return ret.Error(0)
}

func (mr *MockArticleRepository) GetByTitle(ctx interface{}, title string) (model.Article, error) {
	ret := mr.Called(ctx, title)
	return ret.Get(0).(model.Article), ret.Error(1)
}