package service

import (
	"encoding/json"
	"fmt"

	"github.com/shharn/blog/data"
	"github.com/shharn/blog/db"
)

type Root struct {
	Menus []data.Menu `json:"menus,omitempty"`
}

// GetMenus is service for "GET /menus"
func GetMenus() ([]data.Menu, error) {
	res, err := db.QueryData(`
		query {
			menus(func: has(url)) {
				uid
				name
				url
				parent {
					uid
				}
				children: child {
					uid
				}
			}
		}
		`, nil)
	if err != nil {
		return nil, err
	}
	var root Root
	err = json.Unmarshal(res.Json, &root)
	return root.Menus, err
}

// CreateMenu is service for "POST /menus"
func CreateMenu(menu data.Menu) error {
	fmt.Printf("[CreateMenu] menu : ")
	if menu.Parent != nil {
		fmt.Printf("%v\n", menu.Parent)
	}
	////////////////////////////////////////////////////////
	// need to add child uid to parent's children predicate
	// (combine into the same transaction)
	////////////////////////////////////////////////////////
	_, err := db.MutateData(menu)
	fmt.Println(err)
	return err
}

// DeleteMenu is service for "DELETE /menus"
func DeleteMenu(id string) error {
	err := db.DeleteData(id)
	return err
}

// UpdateMenu is service for "PATCH /menus"
func UpdateMenu(menu data.Menu) error {
	_, err := db.MutateData(menu)
	return err
}
