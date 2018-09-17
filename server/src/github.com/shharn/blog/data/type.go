package data

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

// Menu entity type
type Menu struct {
	ID       string  `json:"uid,omitempty"`
	Name     string  `json:"name,omitempty"`
	URL      string  `json:"url"`
	Parent   *[]Menu `json:"parent,omitempty"`
	Children *[]Menu `json:"children,omitempty"`
}

// Menus is a map for [id : menu] pair
type Menus map[int]Menu

// Article entity type
type Article struct {
	ID          string  `json:"uid,omitempty"`
	Title       string  `json:"title,omitempty"`
	ImageSource string  `json:"imageSource,omitempty"`
	Summary     string  `json:"summary,omitempty"`
	Content     string  `json:"content,omitempty"`
	CreatedAt   string  `json:"createdAt, omitempty"`
	Menu        *[]Menu `json:"menu,omitempty"`
}
