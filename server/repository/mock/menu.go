package mock

import (
	"github.com/shharn/blog/model"
	"github.com/shharn/blog/repository"
	"github.com/stretchr/testify/mock"
)

type MockMenuRepository struct {
	mock.Mock
}

func (mr *MockMenuRepository) Context() interface{} {
	ret := mr.Called()
	return ret.Get(0).(repository.Disposable)
}

func (mr *MockMenuRepository) GetAll(ctx interface{}) ([]model.Menu, error) {
	ret := mr.Called(ctx)
	return ret.Get(0).([]model.Menu), ret.Error(1)
}

func (mr *MockMenuRepository) Create(ctx interface{}, menu model.Menu) (string, error) {
	ret := mr.Called(ctx, menu)
	return ret.String(0), ret.Error(1)
}

func (mr *MockMenuRepository) Update(ctx interface{}, menu model.Menu) error {
	ret := mr.Called(ctx, menu)
	return ret.Error(0)
}

func (mr *MockMenuRepository) Get(ctx interface{}, id string) (model.Menu, error) {
	ret := mr.Called(ctx, id)
	return ret.Get(0).(model.Menu), ret.Error(1)
}

func (mr *MockMenuRepository) Delete(ctx interface{}, id string) error {
	ret := mr.Called(ctx, id)
	return ret.Error(0)
}

func (mr *MockMenuRepository) DeleteParent(ctx interface{}, id, pid string) error {
	ret := mr.Called(ctx, id, pid)
	return ret.Error(0)
}

func (mr *MockMenuRepository) DeleteChild(ctx interface{}, id, cid string) error {
	ret := mr.Called(ctx, id, cid)
	return ret.Error(0)
}

func (mr *MockMenuRepository) AddChild(ctx interface{}, id, cid string) error {
	ret := mr.Called(ctx, id, cid)
	return ret.Error(0)
}