package dataloader

import (
	"fmt"

	"puppyloper.blog/data"
)

var (
	menus = data.Menus{
		1: data.Menu{ID: 1, Name: "Admin", URL: "/admin", ParentID: -1},
		2: data.Menu{ID: 2, Name: "Home", URL: "/", ParentID: -1},
		3: data.Menu{ID: 3, Name: "Articles", URL: "/articles", ParentID: -1},
	}
	nextMenuID = 4
)

// GetMenus is service for "GET /menus"
func GetMenus() data.Menus {
	return menus
}

// CreateMenu is service for "POST /menus"
func CreateMenu(menu data.Menu) data.Menu {
	// throw error when duplicate menu name exists later from DB or another way
	menu.ID = nextMenuID
	nextMenuID++
	menus[menu.ID] = menu
	return menu
}

// DeleteMenu deletes the menu with id
func DeleteMenu(id int) data.Menu {
	menu := menus[id]
	delete(menus, id)
	fmt.Println(menus)
	return menu
}

// UpdateMenu updates the menu
func UpdateMenu(menu data.Menu) data.Menu {
	menus[menu.ID] = menu
	return menu
}
