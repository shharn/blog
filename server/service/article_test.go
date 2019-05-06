package service

import (
	"errors"
	"testing"
	"time"

	"github.com/shharn/blog/model"
	repoMock "github.com/shharn/blog/repository/mock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)


type getTheHottestArticlesTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockArticleRepository
}

func (suite *getTheHottestArticlesTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockArticleRepository)
}

func (suite *getTheHottestArticlesTestSuite) TestHappyPath() {
	mockArticles := []model.Article{
		0: model.Article{"0x01", "Title 1", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", nil, 100},
		1: model.Article{"0x02", "Title 2", "ImageSource 2", "Summary 2", "Content 2", "CreatedAt 2", nil, 200},
	}
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("HottestArticles", suite.mc, "1", "2").Return(mockArticles, nil)

	result := svc.GetTheHottestArticles("1", "2")

	assert.Equal(suite.T(), mockArticles, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *getTheHottestArticlesTestSuite) TestWhenErrorFromRepository() {
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("HottestArticles", suite.mc, "1", "5").Return([]model.Article{}, errors.New("mock error"))

	result := svc.GetTheHottestArticles("1", "5")

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type getArticlesOnMenuTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockArticleRepository
}

func (suite *getArticlesOnMenuTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockArticleRepository)
}

func (suite *getArticlesOnMenuTestSuite) TestHappyPath() {
	mockArticles := []model.Article{
		0: model.Article{"0x01", "Title 1", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 100},
		1: model.Article{"0x02", "Title 2", "ImageSource 2", "Summary 2", "Content 2", "CreatedAt 2", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 200},
		2: model.Article{"0x03", "Title 3", "ImageSource 3", "Summary 3", "Content 3", "CreatedAt 3", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 300},
	}
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("ArticlesOnMenu", suite.mc, "0x10", "1", "3").Return(mockArticles, nil)

	result := svc.GetArticlesOnMenu("0x10", "1", "3")

	assert.Equal(suite.T(), mockArticles, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *getArticlesOnMenuTestSuite) TestWhenErrorFromRepository() {
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("ArticlesOnMenu", suite.mc, "0x11", "1", "2").Return([]model.Article{}, errors.New("mock error"))

	result := svc.GetArticlesOnMenu("0x11", "1", "2")

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type createArticleTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockArticleRepository
}

func (suite *createArticleTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockArticleRepository)
}

func (suite *createArticleTestSuite) TestHappyPath() {
	mockArticle := model.Article{"0x01", "Title 1", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 100}
	mutatedArticle := mockArticle
	mutatedArticle.CreatedAt = time.Now().Format(time.RFC3339)
	mutatedArticle.Views = 0
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Create", suite.mc, mutatedArticle).Return(nil)

	err := svc.CreateArticle(mockArticle)

	assert.Nil(suite.T(), err)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *createArticleTestSuite) TestWhenErrorFromRepository() {
	mockArticle := model.Article{"0x01", "Title 1", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 100}
	mutatedArticle := mockArticle
	mutatedArticle.CreatedAt = time.Now().Format(time.RFC3339)
	mutatedArticle.Views = 0
	mockError := errors.New("mock error")
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Create", suite.mc, mutatedArticle).Return(mockError)

	err := svc.CreateArticle(mockArticle)

	assert.Equal(suite.T(), mockError, err)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type getArticleTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockArticleRepository
}

func (suite *getArticleTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockArticleRepository)
}

func (suite *getArticleTestSuite) TestHappyPath() {
	mockArticle := model.Article{"0x01", "Title 1", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 100}
	incrementedArticle := mockArticle
	incrementedArticle.Views = incrementedArticle.Views + 1

	svc := NewArticleService(suite.mr)
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x01").Return(mockArticle, nil)
	suite.mr.On("Update", suite.mc, incrementedArticle).Return(nil)

	result := svc.GetArticle("0x01")

	assert.Equal(suite.T(), incrementedArticle, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *getArticleTestSuite) TestWhenErrorFromGetMethodOfRepository() {
	svc := NewArticleService(suite.mr)
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x01").Return(model.EmptyArticle, errors.New("mock error"))

	result := svc.GetArticle("0x01")

	assert.Equal(suite.T(), model.EmptyArticle, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *getArticleTestSuite) TestWhenErrorFromUpdateMethodOfRepository() {
	mockArticle := model.Article{"0x01", "Title 1", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 100}
	incrementedArticle := mockArticle
	incrementedArticle.Views = incrementedArticle.Views + 1

	svc := NewArticleService(suite.mr)
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x01").Return(mockArticle, nil)
	suite.mr.On("Update", suite.mc, incrementedArticle).Return(errors.New("mock error"))

	result := svc.GetArticle("0x01")

	assert.Equal(suite.T(), incrementedArticle, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type deleteArticleTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockArticleRepository
}

func (suite *deleteArticleTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockArticleRepository)
}

func (suite *deleteArticleTestSuite) TestHappyPath() {
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Delete", suite.mc, "0x01").Return(nil)

	result := svc.DeleteArticle("0x01")

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *deleteArticleTestSuite) TestWhenErrorFromRepository() {
	mockError := errors.New("mock error")
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Delete", suite.mc, "0x01").Return(mockError)

	result := svc.DeleteArticle("0x01")

	assert.Equal(suite.T(), mockError, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type updateArticleTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockArticleRepository
}

func (suite *updateArticleTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockArticleRepository)
}

func (suite *updateArticleTestSuite) TestHappyPath() {
	mockArticle := model.Article{"0x01", "Title 1", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 100}
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Update", suite.mc, mockArticle).Return(nil)

	result := svc.UpdateArticle(mockArticle)

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *updateArticleTestSuite) TestWhenErrorFromRepository() {
	mockArticle := model.Article{"0x01", "Title 1", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 100}
	mockError := errors.New("mock error")
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Update", suite.mc, mockArticle).Return(mockError)

	result := svc.UpdateArticle(mockArticle)

	assert.Equal(suite.T(), mockError, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type getArticleByTitleTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockArticleRepository
}

func (suite *getArticleByTitleTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockArticleRepository)
}

func (suite *getArticleByTitleTestSuite) TestHappyPath() {
	mockArticle := model.Article{"0x01", "test title", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 100}
	incrementedArticle := mockArticle
	incrementedArticle.Views = incrementedArticle.Views + 1

	svc := NewArticleService(suite.mr)
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("GetByTitle", suite.mc, "test title").Return(mockArticle, nil)
	suite.mr.On("Update", suite.mc, incrementedArticle).Return(nil)

	result := svc.GetArticleByTitle("test title")

	assert.Equal(suite.T(), incrementedArticle, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *getArticleByTitleTestSuite) TestWhenErrorFromGetByTitleMethodOfRepository() {
	svc := NewArticleService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("GetByTitle", suite.mc, "test title").Return(model.EmptyArticle, errors.New("mock error"))

	result := svc.GetArticleByTitle("test title")

	assert.Equal(suite.T(), model.EmptyArticle, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *getArticleByTitleTestSuite) TestWhenErrorFromUpdateMethodOfRepository() {
	mockArticle := model.Article{"0x01", "test title", "ImageSource 1", "Summary 1", "Content 1", "CreatedAt 1", &[]model.Menu{model.Menu{"0x10", "Name 1", "URL 1", nil, nil}}, 100}
	incrementedArticle := mockArticle
	incrementedArticle.Views = incrementedArticle.Views + 1

	svc := NewArticleService(suite.mr)
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("GetByTitle", suite.mc, "test title").Return(mockArticle, nil)
	suite.mr.On("Update", suite.mc, incrementedArticle).Return(errors.New("mock error"))

	result := svc.GetArticleByTitle("test title")

	assert.Equal(suite.T(), incrementedArticle, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func TestRunAllArticleServiceTestSuites(t *testing.T) {
	suite.Run(t, new(getTheHottestArticlesTestSuite))
	suite.Run(t, new(getArticlesOnMenuTestSuite))
	suite.Run(t, new(createArticleTestSuite))
	suite.Run(t, new(getArticleTestSuite))
	suite.Run(t, new(deleteArticleTestSuite))
	suite.Run(t, new(updateArticleTestSuite))
	suite.Run(t, new(getArticleByTitleTestSuite))
}