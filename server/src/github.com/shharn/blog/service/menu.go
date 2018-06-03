package service

import (
	"encoding/json"

	"github.com/shharn/blog/data"
	"github.com/shharn/blog/db"
)

const (
	getMenusQuery = `
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
	`
	getParentMenusQuery = `
		query getParentMenus($id: string) {
			parents(func: has(url)) @filter(uid_in(child, $id)) {
				uid
			}
		}
	`
	getChildMenusQuery = `
		query getChildMenus($id: string) {
			children(func: has(url)) @filter(uid_in(parent, $id)) {
				uid
			}
		}
	`
)

type getMenusPayload struct {
	Menus []data.Menu `json:"menus,omitempty"`
}

type addChildMenuInput struct {
	ID    string    `json:"uid,omitempty"`
	Child data.Menu `json:"child,omitempty"`
}

type updateChildMenuInput struct {
	ID    string    `json:"uid,omitempty"`
	Child data.Menu `json:"child,omitempty"`
}

type deleteNodeInput struct {
	ID string `json:"uid,omitempty"`
}

type deleteChildMenuInput struct {
	ID    string    `json:"uid,omitempty"`
	Child data.Menu `json:"child,omitempty"`
}

type deleteParentMenuInput struct {
	ID     string    `json:"uid,omitempty"`
	Parent data.Menu `json:"parent,omitempty"`
}

type getParentMenusPayload struct {
	Parents []data.Menu `json:"parents,omitempty"`
}

type getChildMenusPayload struct {
	Children []data.Menu `json:"children,omitempty"`
}

// GetMenus is service for "GET /menus"
func GetMenus() ([]data.Menu, error) {
	c, err := db.Init()
	res := c.Query(getMenusQuery)
	if c.Error != nil {
		return nil, c.Error
	}
	var root getMenusPayload
	err = json.Unmarshal(res.Json, &root)
	return root.Menus, err
}

// CreateMenu is service for "POST /menus"
func CreateMenu(menu data.Menu) error {
	c, err := db.Init()
	if err != nil {
		return err
	}

	menu.ID = "_:new"
	mds := db.MutationData{
		0: menu,
	}
	if hasParentMenu(menu) {
		input := addChildMenuInput{
			ID: (*menu.Parent)[0].ID,
			Child: data.Menu{
				ID: menu.ID,
			},
		}
		mds = append(mds, input)
	}
	c.MutateTheMultiple(mds)
	c.Commit()
	c.CleanUp()
	return c.Error
}

// DeleteMenu is service for "DELETE /menus"
func DeleteMenu(id string) error {
	c, err := db.Init()
	if err != nil {
		return err
	}

	mds := db.MutationData{}

	// Make a task for deleting node
	dn := deleteNodeInput{ID: id}
	mds = append(mds, dn)

	if exists, res := hasParentMenuWithQuery(c, id, getParentMenusQuery); exists {
		parents := res.Parents
		for idx := 0; idx < len(parents); idx++ {
			mds = append(mds, deleteChildMenuInput{
				ID: parents[idx].ID,
				Child: data.Menu{
					ID: id,
				},
			})
		}
	}

	if exists, res := hasChildMenuWithQuery(c, id, getChildMenusQuery); exists {
		children := res.Children
		for idx := 0; idx < len(children); idx++ {
			mds = append(mds, deleteParentMenuInput{
				ID: children[idx].ID,
				Parent: data.Menu{
					ID: id,
				},
			})
		}
	}

	c.DeleteTheMultiple(mds)
	c.Commit()
	c.CleanUp()
	return err
}

// UpdateMenu is service for "PATCH /menus"
func UpdateMenu(menu data.Menu) error {
	// if menu's parent is mutated, Should mutate the parent menu data
	// md := append(db.MutationData{}, menu)
	_, err := db.MutateData(nil)
	return err
}

func hasParentMenu(menu data.Menu) bool {
	return menu.Parent != nil && len(*menu.Parent) > 0
}

func hasParentMenuWithQuery(c *db.Client, id string, q string) (bool, getParentMenusPayload) {
	vars := map[string]string{"$id": id}
	parents := getParentMenusPayload{}
	res := c.QueryWithVars(q, vars)
	if c.Error != nil {
		return false, parents
	}
	err := json.Unmarshal(res.Json, &parents)
	if err != nil {
		c.Error = err
		return false, parents
	}
	return parents.Parents != nil && len(parents.Parents) > 0, parents
}

func hasChildMenuWithQuery(c *db.Client, id string, q string) (bool, getChildMenusPayload) {
	vars := map[string]string{"$id": id}
	children := getChildMenusPayload{}
	res := c.QueryWithVars(q, vars)
	if c.Error != nil {
		return false, children
	}
	err := json.Unmarshal(res.Json, &children)
	if err != nil {
		c.Error = err
		return false, children
	}
	return children.Children != nil && len(children.Children) > 0, children
}
