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
			Data: data.DataChunk{
				Menus: menus,
			},
		}
		util.JsonResponse(http.StatusOK, responseBody, w)
	case "POST":
		var blogRequest data.BlogRequestBody
		err := json.NewDecoder(r.Body).Decode(&blogRequest)
		if err != nil {
			util.ErrorResponse(w, data.AppError{
				Code:    http.StatusBadRequest,
				Message: "Bad Data Format",
			}, http.StatusBadRequest)
			return
		}
		dataloader.CreateMenu(blogRequest.Data.Menu)
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
