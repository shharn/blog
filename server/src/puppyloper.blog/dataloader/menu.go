package dataloader

type Menu struct {
	url string
	title string
}

var (
	menus []Menu = []Menu{
		Menu{url: "/admin", title: "Admin"},
		Menu{url: "/", title: "Home"}
	}
)

func getMenus() {
	return menus
}