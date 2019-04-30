package handler

import (
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
)

// GetMenusHandler is a handler for "GET /menus"
func GetMenusHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	menus, err := service.GetMenus()
	if err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to get menus", err)
	}
	return menus, router.EmptyErrorResponse
}

// CreateMenuHandler is a handler for "POST /menus"
func CreateMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	var (
		menu model.Menu
		err  error
	)
	if err = json.NewDecoder(rq.Body).Decode(&menu); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusBadRequest, "Fail to deserialize", errors.WithStack(err))
	}
	err = service.CreateMenu(menu)
	return nil, router.EmptyErrorResponse
}

// UpdateMenuHandler is a handler for "PATCH /menus"
func UpdateMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	var (
		menu model.Menu
		err  error
	)
	if err = json.NewDecoder(rq.Body).Decode(&menu); err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusBadRequest, "Fail to deserialize", errors.WithStack(err))
	}
	err = service.UpdateMenu(menu)
	return nil, router.EmptyErrorResponse
}

// DeleteMenuHandler is handler for "DELETE /menus/:id"
func DeleteMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, router.ErrorResponse) {
	id := params["id"].(string)
	err := service.DeleteMenu(id)
	if err != nil {
		return nil, router.NewErrorResponseWithError(http.StatusInternalServerError, "Fail to delete a menu", err)
	}
	return nil, router.EmptyErrorResponse
}
