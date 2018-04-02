package data

import "fmt"

// BlogRequestBody represents the structure of the request to blog
type BlogRequestBody struct {
	Token string              `json:"token"`
	Data  PredefinedDataChunk `json:"data"`
}

// BlogResponseBody is wrapper for json format response
type BlogResponseBody struct {
	Authentication Authentication      `json:"authentication"`
	Data           PredefinedDataChunk `json:"data"`
	Error          AppError            `json:"error"`
}

// PredefinedDataChunk represents the data structure transferred between client & server for domain data
// It includes 'Menu','Article'
type PredefinedDataChunk struct {
	ID               int              `json:"id"`
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
}

// AddChild adds child in the menu
func (menus Menus) AddChild(parentID, childID int) {
	parentMenu := menus[parentID]
	childrenList := parentMenu.ChildrenIDs
	parentMenu.ChildrenIDs = append(childrenList, childID)
}

var (
	// TokenStorage is the storage for the session token made with jwt algorithm
	TokenStorage = SessionStorage{}
)
