package util

import (
	"encoding/json"
	"net/http"
	"fmt"
)

// Helper function for sending the response to client with json string
func JsonResponse(statusCode int , content interface{}, writer http.ResponseWriter) {
	var (
		jsonData []byte
		err error
	)
	fmt.Print(content)
	if jsonData, err = json.Marshal(content); err != nil {
		ErrorResponse(writer, err, http.StatusInternalServerError)
		return
	}
	writer.Header().Set("Content-type", "application/json")
	writer.WriteHeader(statusCode)
	writer.Write(jsonData)
}