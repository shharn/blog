package dataloader

// Menu type
type Menu struct {
	Id int `json:"id"`
	Url string `json:"url"`
	Title string `json:"title"`
	Parent int `json:"parent"`
}

// Menu array type
type Menus map[int]Menu

var (
	menus = Menus{
		1: Menu{Id: 1, Url: "/admin", Title: "Admin", Parent: -1},
		2: Menu{Id: 2, Url: "/", Title: "Home", Parent: -1},
		3: Menu{Id: 3, Url: "/articles", Title: "Articles", Parent: -1},
	}
)

// service for "/menus"
func GetMenus() Menus {
	return menus
}