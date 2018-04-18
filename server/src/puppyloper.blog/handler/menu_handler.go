package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"puppyloper.blog/data"
	"puppyloper.blog/router"
	"puppyloper.blog/service"
)

// GetMenusHandler is a handler for "GET /menus"
func GetMenusHandler(w http.ResponseWriter, r *http.Request, params router.Params) (interface{}, error) {
	menus := service.GetMenus()
	return menus, nil
}

// CreateMenuHandler is a handler for "POST /menus"
func CreateMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	var menu data.Menu
	err := json.NewDecoder(rq.Body).Decode(&menu)
	if err != nil {
		return nil, data.AppError{Code: http.StatusBadRequest, Message: err.Error()}
	}
	createdMenu := service.CreateMenu(menu)
	return createdMenu, nil
}

// UpdateMenuHandler is a handler for "PATCH /menus"
func UpdateMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	var menu data.Menu
	err := json.NewDecoder(rq.Body).Decode(&menu)
	if err != nil {
		return nil, data.AppError{Code: http.StatusBadRequest, Message: err.Error()}
	}
	updatedMenu := service.UpdateMenu(menu)
	return updatedMenu, nil
}

// DeleteMenuHandler is handler for "DELETE /menus/:id"
func DeleteMenuHandler(w http.ResponseWriter, rq *http.Request, params router.Params) (interface{}, error) {
	fmt.Printf("[DeleteMenuHandler] Length of Params : %v, Params: %v\n", len(params), params)
	id, err := strconv.Atoi(params["id"].(string))
	if err != nil {
		return nil, data.AppError{Code: http.StatusBadRequest, Message: err.Error()}
	}
	deletedMenu := service.DeleteMenu(id)
	return deletedMenu, nil
}
