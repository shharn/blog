package data

import "fmt"

// ErrorResponse is a common Http Response Body format
type ErrorResponse struct {
	Message string `json:"message"`
}

func (e ErrorResponse) Error() string {
	return e.Message
}

// Authentication is the data structure used when "POST /check" handler's response
type Authentication struct {
	Token   string `json:"token"`
	IsValid bool   `json:"isValid"`
}

// LoginInformation respresents the data structure which is needed for "GET /login"
type LoginInformation struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// SessionStorage is memory-based storage for session data
type SessionStorage map[string]string

// AppError is for custom error
type AppError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (e AppError) Error() string {
	return fmt.Sprintf("%v", e.Message)
}

// Menu type
type Menu struct {
	ID       string  `json:"uid,omitempty"`
	Name     string  `json:"name,omitempty"`
	URL      string  `json:"url,omitempty"`
	Parent   *[]Menu `json:"parent,omitempty"`
	Children *[]Menu `json:"children,omitempty"`
}

// Menus is a map for [id : menu] pair
type Menus map[int]Menu

var (
	// TokenStorage is the storage for the session token made with jwt algorithm
	TokenStorage = SessionStorage{}
)
