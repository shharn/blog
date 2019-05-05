package handler

import (
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
)

type MenuHandler struct {
	menuService service.MenuService
}

// GetMenusHandler is a handler for "GET /menus"
func (h *MenuHandler) GetMenusHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	menus := h.menuService.GetMenus()
	return menus, router.EmptyErrorResponse
}

// CreateMenuHandler is a handler for "POST /menus"
func (h *MenuHandler) CreateMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	var menu model.Menu
	if err := json.NewDecoder(rq.Body).Decode(&menu); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusBadRequest, "Fail to deserialize", errors.WithStack(err))
	}
	if err := h.menuService.CreateMenu(menu); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to create a menu", err)
	}
	return nil, router.EmptyErrorResponse
}

// UpdateMenuHandler is a handler for "PATCH /menus"
func (h *MenuHandler) UpdateMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	var menu model.Menu
	if err := json.NewDecoder(rq.Body).Decode(&menu); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusBadRequest, "Fail to deserialize", errors.WithStack(err))
	}
	if err := h.menuService.UpdateMenu(menu); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to update a menu", err)
	}
	return nil, router.EmptyErrorResponse
}

// DeleteMenuHandler is handler for "DELETE /menus/:id"
func (h *MenuHandler) DeleteMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	id := params["id"].(string)
	if err := h.menuService.DeleteMenu(id); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to delete a menu", err)
	}
	return nil, router.EmptyErrorResponse
}

func NewMenuHandler(s service.MenuService) *MenuHandler {
	return &MenuHandler{s}
}