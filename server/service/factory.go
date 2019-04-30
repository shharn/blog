package service

import (
	"github.com/pkg/errors"
	"github.com/shharn/blog/model"
)

var factory = map[string]inputFactory{
	"addChildMenuInput":     addChildMenuInputFactory,
	"updateChildMenuInput":  updateChildMenuInputFactory,
	"deleteNodeInput":       deleteNodeInputFactory,
	"deleteChildMenuInput":  deleteChildMenuInputFactory,
	"deleteParentMenuInput": deleteParentMenuInputFactory,
} 

type addChildMenuInput struct {
	ID    string    `json:"uid,omitempty"`
	Child model.Menu `json:"child,omitempty"`
}

type updateChildMenuInput struct {
	ID    string    `json:"uid,omitempty"`
	Child model.Menu `json:"child,omitempty"`
}

type deleteNodeInput struct {
	ID string `json:"uid,omitempty"`
}

type deleteChildMenuInput struct {
	ID    string    `json:"uid,omitempty"`
	Child model.Menu `json:"child,omitempty"`
}

type deleteParentMenuInput struct {
	ID     string    `json:"uid,omitempty"`
	Parent model.Menu `json:"parent,omitempty"`
}

type getMenusPayload struct {
	Menus []model.Menu `json:"menus,omitempty"`
}

type getParentMenusPayload struct {
	Parents []model.Menu `json:"parents,omitempty"`
}

type getChildMenusPayload struct {
	Children []model.Menu `json:"children,omitempty"`
}

type inputFactory func(prop ...interface{}) (interface{}, error)

func registerFactory(name string, f inputFactory) {
	factory[name] = f
}

func addChildMenuInputFactory(props ...interface{}) (interface{}, error) {
	if len(props) != 2 {
		return nil, errors.New("Need exactly 2 properties")
	}
	return addChildMenuInput{
		ID: props[0].(string),
		Child: model.Menu{
			ID: props[1].(string),
		},
	}, nil
}

func updateChildMenuInputFactory(props ...interface{}) (interface{}, error) {
	if len(props) != 2 {
		return nil, errors.New("Need exactly 2 properties")
	}
	return updateChildMenuInput{
		ID: props[0].(string),
		Child: model.Menu{
			ID: props[1].(string),
		},
	}, nil
}

func deleteNodeInputFactory(props ...interface{}) (interface{}, error) {
	if len(props) != 1 {
		return nil, errors.New("Need exactly 1 property")
	}
	return deleteNodeInput{
		ID: props[0].(string),
	}, nil
}

func deleteChildMenuInputFactory(props ...interface{}) (interface{}, error) {
	if len(props) != 2 {
		return nil, errors.New("Need exactly 2 properties")
	}
	return deleteChildMenuInput{
		ID: props[0].(string),
		Child: model.Menu{
			ID: props[1].(string),
		},
	}, nil
}

func deleteParentMenuInputFactory(props ...interface{}) (interface{}, error) {
	if len(props) != 2 {
		return nil, errors.New("Need exactly 2 properties")
	}
	return deleteParentMenuInput{
		ID: props[0].(string),
		Parent: model.Menu{
			ID: props[1].(string),
		},
	}, nil
}