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
	ID          int    `json:"id"`
	Name        string `json:"name"`
	URL         string `json:"url"`
	ParentID    int    `json:"parentId"`
	ChildrenIDs []int  `json:"childrenIDs"`
}

// Menus is a map for [id : menu] pair
type Menus map[int]Menu

// RemoveChild method removes the child from the parent menu
func (menus Menus) RemoveChild(parentID, childID int) {
	parentMenu := menus[parentID]
	childrenList := parentMenu.ChildrenIDs
	pos := -1
	for idx, value := range childrenList {
		if value == childID {
			pos = idx
			break
		}
	}
	if pos != -1 {
		if pos == len(childrenList)-1 {
			parentMenu.ChildrenIDs = childrenList[:pos]
		} else {
			parentMenu.ChildrenIDs = append(childrenList[:pos], childrenList[pos+1:]...)
		}
	}
	menus[parentID] = parentMenu
}

// AddChild adds child in the menu
func (menus Menus) AddChild(parentID, childID int) {
	parentMenu := menus[parentID]
	childrenList := parentMenu.ChildrenIDs
	parentMenu.ChildrenIDs = append(childrenList, childID)
	menus[parentID] = parentMenu
}

var (
	// TokenStorage is the storage for the session token made with jwt algorithm
	TokenStorage = SessionStorage{}
)
