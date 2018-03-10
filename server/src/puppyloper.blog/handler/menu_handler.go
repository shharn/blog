package handler

import (
	"encoding/json"
	"net/http"

	"puppyloper.blog/data"
	"puppyloper.blog/dataloader"
	"puppyloper.blog/util"
)

// MenuHandler is the handler for GET "/menus"
func MenuHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		menus := dataloader.GetMenus()
		responseBody := data.BlogResponseBody{
			Data: map[string]interface{}{
				"menus": menus,
			},
		}
		util.JsonResponse(http.StatusOK, responseBody, w)
		break
	case "POST":
		// check if client has valid token
		var menu data.Menu
		if err := json.NewDecoder(r.Body).Decode(&menu); err != nil {
			util.ErrorResponse(w, err, http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusOK)
		break
	case "PATCH":
		break
	case "DELETE":
		break
	default:
		util.ErrorResponse(w, data.AppError{
			Code:    http.StatusMethodNotAllowed,
			Message: "Not Allowed Method",
		}, http.StatusMethodNotAllowed)
		break
	}
}
