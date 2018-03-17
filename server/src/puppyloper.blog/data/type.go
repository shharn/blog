package data

import "fmt"

// BlogResponseBody is wrapper for json format response
type BlogResponseBody struct {
	Authentication Authentication      `json:"authentication"`
	Data           PredefinedDataChunk `json:"data"`
	Error          AppError            `json:"error"`
}

// PredefinedDataChunk represents the data structure transferred between client & server for domain data
// It includes 'Menu','Article'
type PredefinedDataChunk struct {
	Menu             Menu             `json:"menu"`
	Menus            Menus            `json:"menus"`
	MenuIDList       MenuIDList       `json:"menuIdList"`
	LoginInformation LoginInformation `json:"loginInformation"`
}

// MenuIDList is used when client request 'DELETE' operation for menu
type MenuIDList []int

// Authentication is the data about authentication
type Authentication struct {
	Token           string `json:"token"`
	IsAuthenticated bool   `json:"isAuthenticated"`
}

// BlogRequestBody represents the structure of the request to blog
type BlogRequestBody struct {
	Token string              `json:"token"`
	Data  PredefinedDataChunk `json:"data"`
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
	ID     int    `json:"id"`
	Title  string `json:"title"`
	URL    string `json:"url"`
	Parent int    `json:"parent"`
}

// Menus is a map for [id : menu] pair
type Menus map[int]Menu

var (
	// TokenStorage is the storage for the session token made with jwt algorithm
	TokenStorage = SessionStorage{}
)
