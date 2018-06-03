package handler

import (
	"encoding/json"
	"net/http"

	"github.com/shharn/blog/data"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
)

// GetMenusHandler is a handler for "GET /menus"
func GetMenusHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, error) {
	menus, err := service.GetMenus()
	return menus, err
}

// CreateMenuHandler is a handler for "POST /menus"
func CreateMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	var (
		menu data.Menu
		err  error
	)
	err = json.NewDecoder(rq.Body).Decode(&menu)
	if err != nil {
		return nil, data.AppError{Code: http.StatusBadRequest, Message: err.Error()}
	}
	err = service.CreateMenu(menu)
	return nil, err
}

// UpdateMenuHandler is a handler for "PATCH /menus"
func UpdateMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	var (
		menu data.Menu
		err  error
	)
	err = json.NewDecoder(rq.Body).Decode(&menu)
	if err != nil {
		return nil, data.AppError{Code: http.StatusBadRequest, Message: err.Error()}
	}
	err = service.UpdateMenu(menu)
	return nil, err
}

// DeleteMenuHandler is handler for "DELETE /menus/:id"
func DeleteMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	id := params["id"].(string)
	err := service.DeleteMenu(id)
	return nil, err
}
