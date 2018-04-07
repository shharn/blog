package middleware

import (
	"net/http"
	"strings"
)

// CorsMiddleware enables Cors request
func CorsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Request-Headers", "Access-Control-Request-Headers, Access-Control-Request-Method, Origin, Content-Type, Accept")
		if strings.ToLower(r.Method) == "options" {
			return
		}
		next.ServeHTTP(w, r)
	})
}
