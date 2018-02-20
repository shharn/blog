package middleware

import (
	"net/http"
	"strings"
)

func CorsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Request-Mathod", "GET, DELETE, PUT, POST, OPTIONS")
		w.Header().Set("Access-Control-Request-Headers", "Access-Control-Request-Headers, Access-Control-Request-Method, Origin, Content-Type, Accept")
		w.Header().Set("Content-Type", "application/json")
		if strings.ToLower(r.Method) == "options" {
			return
		} else {
			next.ServeHTTP(w, r)
		}
	})
}
