package dataloader

// Menu type
type Menu struct {
	Id     int    `json:"id"`
	Title  string `json:"title"`
	Url    string `json:"url"`
	Parent int    `json:"parent"`
}

// Menu array type
type Menus map[int]Menu

var (
	menus = Menus{
		1: Menu{Id: 1, Title: "Admin", Url: "/admin", Parent: -1},
		2: Menu{Id: 2, Title: "Home", Url: "/", Parent: -1},
		3: Menu{Id: 3, Title: "Articles", Url: "/articles", Parent: -1},
	}
)

// GetMenu is service for "/menus"
func GetMenus() Menus {
	return menus
}
