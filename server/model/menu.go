package model

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