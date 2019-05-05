package service

import (
	"github.com/shharn/blog/logger"
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/repository"
)

type MenuService interface {
	GetMenus() []model.Menu
	CreateMenu(model.Menu) error
	DeleteMenu(string) error
	UpdateMenu(model.Menu) error
}

type BlogMenuService struct {
	repo repository.MenuRepository
}

func hasParentMenu(menu model.Menu) bool {
	return menu.Parent != nil && len(*menu.Parent) > 0
}

func hasChildMenu(menu model.Menu) bool {
	return menu.Children != nil && len(*menu.Children) > 0
}

// GetMenus is service for "GET /menus"
func (s *BlogMenuService) GetMenus() []model.Menu {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	menus, err := s.repo.GetAll(ctx)
	if err != nil {
		logger.Error(err)
		return []model.Menu{}
	}
	return menus
}

// CreateMenu is service for "POST /menus"
func (s *BlogMenuService) CreateMenu(menu model.Menu) error {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	id, err := s.repo.Create(ctx, menu)
	if err != nil {
		return err
	}

	menu.ID = id
	if !hasParentMenu(menu) {
		return nil
	}
	pmenu, err := s.repo.Get(ctx, (*menu.Parent)[0].ID)
	if err != nil {
		return err
	}
	pmenu.Children = &[]model.Menu{model.Menu{ID:menu.ID}}
	return s.repo.Update(ctx, pmenu)
}

// DeleteMenu is service for "DELETE /menus"
func (s *BlogMenuService) DeleteMenu(id string) error {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()
	menu, err := s.repo.Get(ctx, id)
	if err != nil {
		return err
	}

	if hasParentMenu(menu) {
		pid := (*menu.Parent)[0].ID
		if err := s.repo.DeleteChild(ctx, pid, id); err != nil {
			return err
		}
	}

	if hasChildMenu(menu) {
		children := *menu.Children
		for _, child := range children {
			if err := s.repo.DeleteParent(ctx, child.ID, id); err != nil {
				return err
			}
		}
	}
	return s.repo.Delete(ctx, id)
}

// UpdateMenu is service for "PATCH /menus"
// If the client wants to delete a parent, send a no parent field within Menu structure(so, results in nil of menu.Parent)
func (s *BlogMenuService) UpdateMenu(menu model.Menu) error {
	ctx := s.repo.Context()
	defer ctx.(repository.Disposable).Dispose()

	id := menu.ID
	oldMenu, err := s.repo.Get(ctx, id)
	if err != nil {
		return err
	}

	if hasParentMenu(oldMenu) {
		if menu.Parent == nil || (*menu.Parent)[0].ID != (*oldMenu.Parent)[0].ID {
			opid := (*oldMenu.Parent)[0].ID
			if err := s.repo.DeleteChild(ctx, opid, id); err != nil {
				return err
			}
			if err := s.repo.DeleteParent(ctx, id, opid); err != nil {
				return err
			}
		}
	}

	if menu.Parent != nil {
		pid := (*menu.Parent)[0].ID
		if err := s.repo.AddChild(ctx, pid, id); err != nil {
			return err
		}
	}

	return s.repo.Update(ctx, menu)
}

func NewMenuService(r repository.MenuRepository) MenuService {
	return &BlogMenuService{r}
}