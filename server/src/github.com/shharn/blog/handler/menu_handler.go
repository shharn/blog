package handler

import (
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/router"
	"github.com/shharn/blog/service"
)

// GetMenusHandler is a handler for "GET /menus"
func GetMenusHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, error) {
	return service.GetMenus()
}

// CreateMenuHandler is a handler for "POST /menus"
func CreateMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	var (
		menu data.Menu
		err  error
	)
	if err = json.NewDecoder(rq.Body).Decode(&menu); err != nil {
		return nil, errors.WithStack(err)
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
	if err = json.NewDecoder(rq.Body).Decode(&menu); err != nil {
		return nil, errors.WithStack(err)
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
