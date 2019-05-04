package service

import (
	"time"

	"github.com/shharn/blog/model"
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/repository"
)

type ArticleService interface {
	GetTheHottestArticles(string, string) []model.Article
	GetArticlesOnMenu(string, string, string) []model.Article
	CreateArticle(model.Article) error
	GetArticle(string) model.Article
	DeleteArticle(string) error
	UpdateArticle(model.Article) error
	GetArticleByTitle(string) model.Article
}

type BlogArticleService struct {
	repo repository.ArticleRepository
}

func (s *BlogArticleService) GetTheHottestArticles(offset, count string) []model.Article {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	articles, err := s.repo.HottestArticles(ctx, offset, count)
	if err != nil {
		logger.Error(err)
		return nil
	}
	return articles
}

func (s *BlogArticleService) GetArticlesOnMenu(mid, offset, count string) []model.Article {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	articles, err := s.repo.ArticlesOnMenu(ctx, mid, offset, count)
	if err != nil {
		logger.Error(err)
		return nil
	}
	return articles
}

func (s *BlogArticleService) CreateArticle(article model.Article) error {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	article.CreatedAt = time.Now().Format(time.RFC3339)
	article.Views = 0
	return s.repo.Create(ctx, article)
}

func (s *BlogArticleService) GetArticle(id string) model.Article {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	article, err := s.repo.Get(ctx, id)
	if err != nil {
		logger.Error(err)
		return model.EmptyArticle
	}
	article.Views = article.Views + 1
	if err := s.repo.Update(ctx, article); err != nil {
		logger.Error(err)
	}
	return article
}

func (s *BlogArticleService) DeleteArticle(id string) error {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	return s.repo.Delete(ctx, id)
}

func (s *BlogArticleService) UpdateArticle(article model.Article) error {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	return s.repo.Update(ctx, article)
}

func (s *BlogArticleService) GetArticleByTitle(title string) model.Article {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	article, err := s.repo.GetByTitle(ctx, title)
	if err != nil {
		logger.Error(err)
		return model.EmptyArticle
	}

	article.Views = article.Views + 1
	if err := s.repo.Update(ctx, article); err != nil {
		logger.Error(err)
	}
	return article
}

func NewArticleService(r repository.ArticleRepository) ArticleService {
	return &BlogArticleService{r}
}
