package model

// Authentication is the data structure used when "POST /check" handler's response
type Authentication struct {
	Token   string `json:"token"`
	IsValid bool   `json:"isValid"`
	Platform string `json:"platform"`
	Admin bool `json:"admin"`
}

// LoginInformation respresents the data structure which is needed for "GET /login"
type LoginInformation struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
