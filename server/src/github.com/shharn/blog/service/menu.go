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
	res, err := c.Query(getMenusQuery)
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
	if hasParentMenu(menu) {
		input := addChildMenuInput{
			ID: (*menu.Parent)[0].ID,
			Child: data.Menu{
				ID: menu.ID,
			},
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

	mds := db.MutationData{}
	dn := deleteNodeInput{ID: id}
	mds = append(mds, dn)

	if pmd, exists, err := getMutationDataForUpdatingParent(c, id, getParentMenusQuery); err == nil {
		if exists {
			mds = append(mds, pmd...)
		}
	} else {
		return err
	}

	if cmd, exists, err := getMutationDataForUpdatingChildren(c, id, getChildMenusQuery); err == nil {
		if exists {
			mds = append(mds, cmd...)
		}
	} else {
		return err
	}

	if _, err := c.Delete(mds); err != nil {
		return err
	}
	defer c.Commit()
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

	parents, exists, err := getParentMenuWithQuery(c, menu.ID, getParentMenusQuery)
	if err != nil {
		return err
	}

	dmd := db.MutationData{}
	mmd := db.MutationData{
		0: menu,
	}

	if exists {
		if menu.Parent == nil || (*menu.Parent)[0].ID != parents.Parents[0].ID {
			// delete old child menu id from the old parent menu
			dmd = append(dmd, deleteChildMenuInput{
				ID: parents.Parents[0].ID,
				Child: data.Menu{
					ID: menu.ID,
				},
			})
			// delete old parent menu id from it
			dmd = append(dmd, deleteParentMenuInput{
				ID: menu.ID,
				Parent: data.Menu{
					ID: parents.Parents[0].ID,
				},
			})
		}
	}
	if len(dmd) > 0 {
		if _, err = c.Delete(dmd); err != nil {
			return err
		}
	}

	if menu.Parent != nil && !(exists && (*menu.Parent)[0].ID == parents.Parents[0].ID) {
		mmd = append(mmd, addChildMenuInput{
			ID: (*menu.Parent)[0].ID,
			Child: data.Menu{
				ID: menu.ID,
			},
		})
	}
	_, err = c.Mutate(mmd)
	defer c.Commit()
	return err
}

func hasParentMenu(menu data.Menu) bool {
	return menu.Parent != nil && len(*menu.Parent) > 0
}

func getMutationDataForUpdatingParent(c *db.Client, id string, q string) (db.MutationData, bool, error) {
	var (
		mds    = db.MutationData{}
		res    getParentMenusPayload
		exists bool
		err    error
	)

	if res, exists, err = getParentMenuWithQuery(c, id, getParentMenusQuery); err != nil {
		return mds, false, err
	}

	if exists {
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
	return mds, exists, nil
}

func getMutationDataForUpdatingChildren(c *db.Client, id string, q string) (db.MutationData, bool, error) {
	var (
		mds    = db.MutationData{}
		res    getChildMenusPayload
		exists bool
		err    error
	)

	if res, exists, err = getChildMenuWithQuery(c, id, q); err != nil {
		return mds, false, err
	}

	if exists {
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
	return mds, exists, nil

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
