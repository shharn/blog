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
				id: uid
				name
				url
				parent {
					id: uid
				}
				children: child {
					id: uid
				}
			}
		}
		`, nil)
	if err != nil {
		return nil, err
	}
	fmt.Println(string(res.Json))
	var root Root
	err = json.Unmarshal(res.Json, &root)
	fmt.Println(root)
	return root.Menus, err
}

// CreateMenu is service for "POST /menus"
func CreateMenu(menu data.Menu) error {
	fmt.Printf("[CreateMenu] menu : ")
	fmt.Println(menu)
	_, err := db.MutateData(menu)
	fmt.Println(err)
	return err
}

// DeleteMenu is service for "DELETE /menus"
func DeleteMenu(id int) error {
	err := db.DeleteData(id)
	return err
}

// UpdateMenu is service for "PATCH /menus"
func UpdateMenu(menu data.Menu) error {
	_, err := db.MutateData(menu)
	return err
}
