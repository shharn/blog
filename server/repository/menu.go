package repository

import (
	"encoding/json"

	"github.com/pkg/errors"
	"github.com/shharn/blog/db"
	"github.com/shharn/blog/model"
)

type MenuRepository interface {
	GetAll(interface{}) ([]model.Menu, error)
	Create(interface{}, model.Menu) (string, error)
	Update(interface{}, model.Menu) error
	Get(interface{}, string) (model.Menu, error)
	Delete(interface{}, string) error
	DeleteParent(interface{}, string, string) error
	DeleteChild(interface{}, string, string) error
	AddChild(interface{}, string, string) error
	Contextual
}

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
	getMenuQuery = `
		query getMenu($id: string) {
			menus(func: uid($id)) {
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
	Menus []model.Menu `json:"menus,omitempty"`
}

type getMenuPayload struct {
	Menus []model.Menu `json:"menus,omitempty"`
}

type DgraphMenuRepository struct {}

func (r *DgraphMenuRepository) Context() interface{} {
	c, err := db.Init()
	if err != nil {
		panic(err)
	}
	return &dgraphRepositoryContext{c, nil}
}

func (r *DgraphMenuRepository) GetAll(ctx interface{}) ([]model.Menu, error) {
	rctx := ctx.(*dgraphRepositoryContext)
	res, err := rctx.Client.Query(getMenusQuery)
	if err != nil {
		rctx.Err = err
		return []model.Menu{}, err
	}
	var payload getMenusPayload
	if err := json.Unmarshal(res.Json, &payload); err != nil {
		rctx.Err = err
		return []model.Menu{}, errors.New(err.Error())
	}
	return payload.Menus, nil
}

func (r *DgraphMenuRepository) Create(ctx interface{}, menu model.Menu) (string, error) {
	rctx := ctx.(*dgraphRepositoryContext)
	menu.ID = "_:new"
	md := db.MutationData{menu}
	assigned, err := rctx.Client.Mutate(md)
	if err != nil {
		rctx.Err = err
		return "", err
	}
	return assigned.Uids["new"], nil
}

func (r *DgraphMenuRepository) Update(ctx interface{}, menu model.Menu) error {
	rctx := ctx.(*dgraphRepositoryContext)
	md := db.MutationData{menu}
	_, err := rctx.Client.Mutate(md)
	if err != nil {
		rctx.Err = err
	}
	return err
}

func (r *DgraphMenuRepository) Get(ctx interface{}, id string) (model.Menu, error) {
	rctx := ctx.(*dgraphRepositoryContext)
	vars := map[string]string{"$id":id}
	res, err := rctx.Client.QueryWithVars(getMenuQuery, vars)
	if err != nil {
		rctx.Err = err
		return model.EmptyMenu, err
	}

	var payload getMenuPayload
	if err := json.Unmarshal(res.Json, &payload); err != nil {
		rctx.Err = err
		return model.EmptyMenu, errors.New(err.Error())
	}
	
	if len(payload.Menus) < 1 {
		return model.EmptyMenu, nil
	}
	return payload.Menus[0], nil
}

func (r *DgraphMenuRepository) Delete(ctx interface{}, id string) error {
	rctx := ctx.(*dgraphRepositoryContext)
	_, err := rctx.Client.DeleteNode(id)
	rctx.Err = err
	return err
}

func (r *DgraphMenuRepository) DeleteParent(ctx interface{}, id, pid string) error {
	rctx := ctx.(*dgraphRepositoryContext)
	_, err := rctx.Client.DeleteEdge(id, "parent", pid)
	rctx.Err = err
	return err
}

func (r *DgraphMenuRepository) DeleteChild(ctx interface{}, id, cid string) error {
	rctx := ctx.(*dgraphRepositoryContext)
	_, err := rctx.Client.DeleteEdge(id, "child", cid)
	rctx.Err = err
	return err
}

func (r *DgraphMenuRepository) AddChild(ctx interface{}, id, cid string) error {
	rctx := ctx.(*dgraphRepositoryContext)
	_, err := rctx.Client.AddEdge(id, "child", cid)
	rctx.Err = err
	return err
}

func NewMenuRepository() MenuRepository {
	return &DgraphMenuRepository{}
}