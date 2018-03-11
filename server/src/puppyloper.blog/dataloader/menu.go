package dataloader

import (
	"fmt"

	"puppyloper.blog/data"
)

var (
	menus = data.Menus{
		1: data.Menu{ID: 1, Title: "Admin", URL: "/admin", Parent: -1},
		2: data.Menu{ID: 2, Title: "Home", URL: "/", Parent: -1},
		3: data.Menu{ID: 3, Title: "Articles", URL: "/articles", Parent: -1},
	}
	nextMenuID = 4
)

// GetMenus is service for "GET /menus"
func GetMenus() data.Menus {
	return menus
}

// CreateMenu is service for "POST /menus"
func CreateMenu(menu data.Menu) {
	// throw error when duplicate menu title exists later from DB or another way
	menu.ID = nextMenuID
	nextMenuID++
	menus[menu.ID] = menu
	fmt.Println("[DataLoader] after create menu")
	fmt.Println(menus)
}
