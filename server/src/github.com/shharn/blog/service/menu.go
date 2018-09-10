package service

import (
	"encoding/json"
	"reflect"

	"github.com/pkg/errors"
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

// GetMenus is service for "GET /menus"
func GetMenus() ([]data.Menu, error) {
	c, err := db.Init()
	defer c.CleanUp()
	if err != nil {
		return nil, err
	}
	res, err := c.Query(getMenusQuery)
	defer c.Commit()
	if err != nil {
		return nil, err
	}
	var root getMenusPayload
	if err := json.Unmarshal(res.Json, &root); err != nil {
		return nil, errors.New(err.Error())
	}
	return root.Menus, nil
}

// CreateMenu is service for "POST /menus"
func CreateMenu(menu data.Menu) error {
	c, err := db.Init()
	defer c.CleanUp()

	if err != nil {
		return err
	}

	menu.ID = "_:new"
	mds := db.MutationData{
		0: menu,
	}

	if menu.Parent != nil && len((*menu.Parent)[0].ID) > 0 {
		input, err := factory["addChildMenuInput"]((*menu.Parent)[0].ID, menu.ID)
		if err != nil {
			return err
		}
		mds = append(mds, input)
	}
	if _, err := c.Mutate(mds); err != nil {
		return err
	}
	defer c.Commit()
	return nil
}

// DeleteMenu is service for "DELETE /menus"
func DeleteMenu(id string) error {
	c, err := db.Init()
	defer c.CleanUp()
	if err != nil {
		return err
	}
	defer c.Commit()

	if parent, exists, err := hasParentMenu(id, c); err != nil {
		return err
	} else if exists {
		if _, err := c.DeleteEdge(parent.ID, "child", id); err != nil {
			return err
		}
	}

	if children, exists, err := hasChildMenu(id, c); err != nil {
		return err
	} else if exists {
		for _, child := range children {
			if _, err := c.DeleteEdge(child.ID, "parent", id); err != nil {
				return err
			}
		}
	}

	if _, err := c.DeleteNode(id); err != nil {
		return err
	}
	return nil
}

// UpdateMenu is service for "PATCH /menus"
// If the client wants to delete a parent, send a no parent field within Menu structure(so, results in nil of menu.Parent)
func UpdateMenu(menu data.Menu) error {
	c, err := db.Init()
	defer c.CleanUp()
	if err != nil {
		return err
	}
	defer c.Commit()

	if oldParent, exists, err := hasParentMenu(menu.ID, c); err != nil {
		return err
	} else if exists {
		if isParentMenuChanged(menu, oldParent) {
			c.DeleteEdge(oldParent.ID, "child", menu.ID)
			c.DeleteEdge(menu.ID, "parent", oldParent.ID)
		}
	}

	if menu.Parent != nil {
		// really need it?
		if _, err := c.AddEdge(menu.ID, "parent", (*menu.Parent)[0].ID); err != nil {
			return err
		}

		if _, err := c.AddEdge((*menu.Parent)[0].ID, "child", menu.ID); err != nil {
			return err
		}
	}
	mmd := db.MutationData{menu}
	_, err2 := c.Mutate(mmd)
	return err2
}

func hasParentMenu(menuID string, c *db.Client) (data.Menu, bool, error) {
	res, exists, err := getParentMenuWithQuery(c, menuID, getParentMenusQuery)
	if err != nil {
		return data.Menu{}, false, err
	}

	if exists {
		return res.Parents[0], exists, nil
	}
	return data.Menu{}, exists, nil
}

func hasChildMenu(menuID string, c *db.Client) ([]data.Menu, bool, error) {
	res, exists, err := getChildMenuWithQuery(c, menuID, getChildMenusQuery)
	if err != nil {
		return []data.Menu{}, false, err
	}

	if exists {
		return res.Children, exists, nil
	}
	return []data.Menu{}, exists, nil
}

func isParentMenuChanged(current, oldParent data.Menu) bool {
	return current.Parent == nil || (*current.Parent)[0].ID != oldParent.ID
}

func getParentMenuWithQuery(c *db.Client, id string, q string) (getParentMenusPayload, bool, error) {
	parents := getParentMenusPayload{}
	if err := getConnectedNodesWithUID(c, id, q, &parents); err != nil {
		return parents, false, err
	}
	return parents, parents.Parents != nil && len(parents.Parents) > 0, nil
}

func getChildMenuWithQuery(c *db.Client, id string, q string) (getChildMenusPayload, bool, error) {
	children := getChildMenusPayload{}
	if err := getConnectedNodesWithUID(c, id, q, &children); err != nil {
		return children, false, err
	}
	return children, children.Children != nil && len(children.Children) > 0, nil
}

func getConnectedNodesWithUID(c *db.Client, id string, q string, ptr interface{}) error {
	tp := reflect.TypeOf(ptr)
	if tp.Kind() != reflect.Ptr {
		return errors.New("The target object you want to deserialize from the bytes must be pointer type")
	}
	vars := map[string]string{"$id": id}
	res, err := c.QueryWithVars(q, vars)
	if err != nil {
		return err
	}
	err = json.Unmarshal(res.Json, ptr)
	if err != nil {
		return errors.New(err.Error())
	}
	return nil
}
