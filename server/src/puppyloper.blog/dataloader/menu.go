package dataloader

import (
	"fmt"

	"puppyloper.blog/data"
)

var (
	menus = data.Menus{
		1: data.Menu{ID: 1, Name: "Admin", URL: "/admin", ParentID: -1, ChildrenIDs: []int{4}},
		2: data.Menu{ID: 2, Name: "Home", URL: "/", ParentID: -1, ChildrenIDs: []int{}},
		3: data.Menu{ID: 3, Name: "Articles", URL: "/articles", ParentID: -1, ChildrenIDs: []int{}},
		4: data.Menu{ID: 4, Name: "Child1", URL: "/child1", ParentID: 1, ChildrenIDs: []int{}},
	}
	nextMenuID = 5
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

// DeleteMenu is service for "DELETE /menus"
func DeleteMenu(id int) data.Menu {
	menu := menus[id]
	delete(menus, id)
	fmt.Println(menus)
	return menu
}

// UpdateMenu is service for "PATCH /menus"
func UpdateMenu(menu data.Menu) data.Menu {
	oldMenu := menus[menu.ID]
	if oldMenu.ParentID != menu.ParentID {
		oldParentMenu := menus[oldMenu.ParentID]
		menus.RemoveChild(oldParentMenu.ID, menu.ID)
		if menu.ParentID != -1 {
			menus.AddChild(menu.ParentID, menu.ID)
		}
	}
	menus[menu.ID] = menu
	return menu
}
