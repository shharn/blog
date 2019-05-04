package model

// Article entity type
type Article struct {
	ID          string  `json:"uid,omitempty"`
	Title       string  `json:"title,omitempty"`
	ImageSource string  `json:"imageSource,omitempty"`
	Summary     string  `json:"summary,omitempty"`
	Content     string  `json:"content,omitempty"`
	CreatedAt   string  `json:"createdAt,omitempty"`
	Menu        *[]Menu `json:"menu,omitempty"`
	Views	int `json:"views,omitempty"`
}

var EmptyArticle = Article{}