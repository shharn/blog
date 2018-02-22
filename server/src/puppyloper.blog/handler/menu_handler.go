package handler

import (
	"net/http"	
	"puppyloper.blog/dataloader"
	"puppyloper.blog/util"
)

// Handler for GET "/menus"
func MenuHandler(w http.ResponseWriter, r *http.Request) {
	menus := dataloader.GetMenus()
	util.JsonResponse(http.StatusOK, menus, w)
}