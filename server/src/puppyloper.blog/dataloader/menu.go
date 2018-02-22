package dataloader

// Menu type
type Menu struct {
	Url string
	Title string
}

// Menu array type
type Menus []Menu

var (
	menus = Menus{
		Menu{Url: "/admin", Title: "Admin"},
		Menu{Url: "/", Title: "Home"},
	}
)

// service for "/menus"
func GetMenus() Menus {
	return menus
}