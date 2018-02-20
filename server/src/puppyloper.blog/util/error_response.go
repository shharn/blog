package util

import (
	"net/http"
	"fmt"
)

func ErrorResponse(w http.ResponseWriter, e error, statusCode int) {
	if e != nil {
		fmt.Println(e.Error())
		JsonResponse(statusCode, e, w)
	}
}