package util

import (
	"net/http"
)

func ErrorResponse(w http.ResponseWriter, e error, statusCode int) {
	if e != nil {
		JSONResponse(statusCode, e, w)
	}
}
