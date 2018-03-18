package handler

import (
	"encoding/json"
	"fmt"
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
			Data: data.PredefinedDataChunk{
				Menus: menus,
			},
		}
		util.JSONResponse(http.StatusOK, responseBody, w)
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
		createdMenu := dataloader.CreateMenu(blogRequest.Data.Menu)
		responseBody := data.BlogResponseBody{
			Data: data.PredefinedDataChunk{
				Menu: createdMenu,
			},
		}
		util.JSONResponse(http.StatusOK, responseBody, w)
		break
	case "PATCH":
		break
	case "DELETE":
		fmt.Println("Delete!!!")
		var blogRequest data.BlogRequestBody
		err := json.NewDecoder(r.Body).Decode(&blogRequest)
		if err != nil {
			util.ErrorResponse(w, data.AppError{
				Code:    http.StatusBadRequest,
				Message: "Bad Data Format",
			}, http.StatusBadRequest)
			return
		}
		menu := dataloader.DeleteMenu(blogRequest.Data.ID)
		responseBody := data.BlogResponseBody{
			Data: data.PredefinedDataChunk{
				Menu: menu,
			},
		}
		util.JSONResponse(http.StatusOK, responseBody, w)
		break
	default:
		util.ErrorResponse(w, data.AppError{
			Code:    http.StatusMethodNotAllowed,
			Message: "Not Allowed Method",
		}, http.StatusMethodNotAllowed)
		break
	}
}
