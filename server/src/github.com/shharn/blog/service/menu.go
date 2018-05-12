package service

import (
	"github.com/shharn/blog/data"
	"github.com/shharn/blog/db"
)

// GetMenus is service for "GET /menus"
func GetMenus() (data.Menus, error) {
	menus, err := db.QueryData(`
		data(func: has(url)) {
			uid
			name
			url
			parent {
				uid
			}
			children
		}
		`, nil)
	return menus.(data.Menus), err
}

// CreateMenu is service for "POST /menus"
func CreateMenu(menu data.Menu) error {
	uid, err := db.MutateData(menu)
	return err
}

// DeleteMenu is service for "DELETE /menus"
func DeleteMenu(id int) error {
	return db.DeleteData(id)
}

// UpdateMenu is service for "PATCH /menus"
func UpdateMenu(menu data.Menu) error {
	_, err := db.MutateData(menu)
	return err
}
