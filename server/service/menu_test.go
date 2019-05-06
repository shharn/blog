package service

import (
	"errors"
	"testing"

	"github.com/shharn/blog/model"
	// "github.com/shharn/blog/repository"
	repoMock "github.com/shharn/blog/repository/mock"
	"github.com/stretchr/testify/assert"
	// "github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
)

type getMenusTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockMenuRepository
}

func (suite *getMenusTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockMenuRepository)
}

func (suite *getMenusTestSuite) TestHappyPath() {
	mockMenus := []model.Menu{
		0: model.Menu{"0x01", "menu 1", "", nil, nil},
		1: model.Menu{"0x02", "menu 2", "", nil, nil},
		2: model.Menu{"0x03", "menu 3", "", nil, nil},
	}
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("GetAll", suite.mc).Return(mockMenus, nil)

	result := svc.GetMenus()

	assert.Equal(suite.T(), mockMenus, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *getMenusTestSuite) TestWhenErrorFromRepository() {
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("GetAll", suite.mc).Return([]model.Menu{}, errors.New("mock error"))

	result := svc.GetMenus()

	assert.Equal(suite.T(), []model.Menu{}, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type createMenuTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockMenuRepository
}

func (suite *createMenuTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockMenuRepository)
}

func (suite *createMenuTestSuite) TestHappyPathWithoutParentMenu() {
	mockMenu := model.Menu{"", "name 1", "", nil, nil}
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Create", suite.mc, mockMenu).Return("0x01", nil)

	result := svc.CreateMenu(mockMenu)

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *createMenuTestSuite) TestHappyPathWithParentMenu() {
	parentMenu := model.Menu{"0x01", "parent menu", "", nil, nil}
	updatedParentMenu := parentMenu
	updatedParentMenu.Children = &[]model.Menu{model.Menu{ID:"0x02"}}
	mockMenu := model.Menu{"", "name 1", "", &[]model.Menu{parentMenu}, nil}
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Create", suite.mc, mockMenu).Return("0x02", nil)
	suite.mr.On("Get", suite.mc, "0x01").Return(parentMenu, nil)
	suite.mr.On("AddChild", suite.mc, "0x01", "0x02").Return(nil)

	result := svc.CreateMenu(mockMenu)

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *createMenuTestSuite) TestWhenErrorFromCreateMethodOfRepository() {
	mockMenu := model.Menu{"", "name 1", "", nil, nil}
	mockError := errors.New("mock error")
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Create", suite.mc, mockMenu).Return("", mockError)

	result := svc.CreateMenu(mockMenu)

	assert.Equal(suite.T(), mockError, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *createMenuTestSuite) TestWhenErrorFromAddChildMethodOfRepository() {
	parentMenu := model.Menu{"0x01", "parent menu", "", nil, nil}
	updatedParentMenu := parentMenu
	updatedParentMenu.Children = &[]model.Menu{model.Menu{ID:"0x02"}}
	mockMenu := model.Menu{"", "name 1", "", &[]model.Menu{parentMenu}, nil}
	mockError := errors.New("mock error")
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Create", suite.mc, mockMenu).Return("0x02", nil)
	suite.mr.On("Get", suite.mc, "0x01").Return(parentMenu, nil)
	suite.mr.On("AddChild", suite.mc, "0x01", "0x02").Return(mockError)
	
	result := svc.CreateMenu(mockMenu)

	assert.Equal(suite.T(), mockError, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *createMenuTestSuite) TestWhenErrorFromGetMethodOfRepository() {
	parentMenu := model.Menu{"0x01", "parent menu", "", nil, nil}
	mockMenu := model.Menu{"", "name 1", "", &[]model.Menu{parentMenu}, nil}
	mockError := errors.New("mock error")
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Create", suite.mc, mockMenu).Return("0x02", nil)
	suite.mr.On("Get", suite.mc, "0x01").Return(model.Menu{}, mockError)

	result := svc.CreateMenu(mockMenu)

	assert.Equal(suite.T(), mockError, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type deleteMenuTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockMenuRepository
}

func (suite *deleteMenuTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockMenuRepository)
}

func (suite *deleteMenuTestSuite) TestHappyPathWithoutParentAndChildMenu() {
	mockMenu := model.Menu{"0x01", "name 1", "", nil, nil}
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x01").Return(mockMenu, nil)
	suite.mr.On("Delete", suite.mc, "0x01").Return(nil)

	result := svc.DeleteMenu("0x01")

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *deleteMenuTestSuite) TestHappyPathWithOnlyParentMenu() {
	parentMenu := model.Menu{"0x01", "parent menu", "", nil, nil}
	mockMenu := model.Menu{"0x02", "name 1", "", &[]model.Menu{parentMenu}, nil}
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x02").Return(mockMenu, nil)
	suite.mr.On("DeleteChild", suite.mc, "0x01", "0x02").Return(nil)
	suite.mr.On("Delete", suite.mc, "0x02").Return(nil)

	result := svc.DeleteMenu("0x02")

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *deleteMenuTestSuite) TestHappyPathWithOnlyChildrenMenu() {
	childMenu1 := model.Menu{"0x02", "child 1", "", nil, nil}
	childMenu2 := model.Menu{"0x03", "child 2", "", nil, nil}
	mockMenu := model.Menu{"0x01", "name 1", "", nil, &[]model.Menu{childMenu1, childMenu2}}
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x01").Return(mockMenu, nil)
	suite.mr.On("DeleteParent", suite.mc, "0x02", "0x01").Return(nil)
	suite.mr.On("DeleteParent", suite.mc, "0x03", "0x01").Return(nil)
	suite.mr.On("Delete", suite.mc, "0x01").Return(nil)

	result := svc.DeleteMenu("0x01")

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *deleteMenuTestSuite) TestHappyPathWithBoth() {
	parentMenu := model.Menu{"0x01", "parent 1", "", nil, nil}
	childMenu1 := model.Menu{"0x03", "child 1", "", nil, nil}
	childMenu2 := model.Menu{"0x04", "child 2", "", nil, nil}
	mockMenu := model.Menu{"0x02", "name 1", "", &[]model.Menu{parentMenu}, &[]model.Menu{childMenu1, childMenu2}}

	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x02").Return(mockMenu, nil)
	suite.mr.On("DeleteChild", suite.mc, "0x01", "0x02").Return(nil)
	suite.mr.On("DeleteParent", suite.mc, "0x03", "0x02").Return(nil)
	suite.mr.On("DeleteParent", suite.mc, "0x04", "0x02").Return(nil)
	suite.mr.On("Delete", suite.mc, "0x02").Return(nil)

	result := svc.DeleteMenu("0x02")

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *deleteMenuTestSuite) TestWhenErrorFromGetMethodOfRepository() {
	mockError := errors.New("mock error")
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x01").Return(model.EmptyMenu, mockError)

	result := svc.DeleteMenu("0x01")

	assert.Equal(suite.T(), mockError, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *deleteMenuTestSuite) TestWhenErrorFromDeleteChildMethodOfRepository() {
	parentMenu := model.Menu{"0x01", "parent menu", "", nil, nil}
	mockMenu := model.Menu{"0x02", "name 1", "", &[]model.Menu{parentMenu}, nil}
	mockError := errors.New("mock error")
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x02").Return(mockMenu, nil)
	suite.mr.On("DeleteChild", suite.mc, "0x01", "0x02").Return(mockError)

	result := svc.DeleteMenu("0x02")

	assert.Equal(suite.T(), mockError, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *deleteMenuTestSuite) TestWhenErrorFromDeleteParentMethodOfRepository() {
	childMenu1 := model.Menu{"0x02", "child 1", "", nil, nil}
	childMenu2 := model.Menu{"0x03", "child 2", "", nil, nil}
	mockMenu := model.Menu{"0x01", "name 1", "", nil, &[]model.Menu{childMenu1, childMenu2}}
	mockError := errors.New("mock error")
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x01").Return(mockMenu, nil)
	suite.mr.On("DeleteParent", suite.mc, "0x02", "0x01").Return(mockError)

	result := svc.DeleteMenu("0x01")

	assert.Equal(suite.T(), mockError, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *deleteMenuTestSuite) TestWhenErrorFromDeleteMethodOfRepository() {
	childMenu1 := model.Menu{"0x02", "child 1", "", nil, nil}
	childMenu2 := model.Menu{"0x03", "child 2", "", nil, nil}
	mockMenu := model.Menu{"0x01", "name 1", "", nil, &[]model.Menu{childMenu1, childMenu2}}
	mockError := errors.New("mock error")
	svc := NewMenuService(suite.mr)

	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x01").Return(mockMenu, nil)
	suite.mr.On("DeleteParent", suite.mc, "0x02", "0x01").Return(nil)
	suite.mr.On("DeleteParent", suite.mc, "0x03", "0x01").Return(nil)
	suite.mr.On("Delete", suite.mc, "0x01").Return(mockError)

	result := svc.DeleteMenu("0x01")

	assert.Equal(suite.T(), mockError, result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

type updateMenuTestSuite struct {
	suite.Suite
	mc *repoMock.MockContext
	mr *repoMock.MockMenuRepository
}

func (suite *updateMenuTestSuite) SetupTest() {
	suite.mc = new(repoMock.MockContext)
	suite.mr = new(repoMock.MockMenuRepository)
}

func (suite *updateMenuTestSuite) TestHappyPathWithoutParentChanges() {
	mockParentMenu := model.Menu{"0x01", "parent 1", "", nil, nil}
	mockMenuToUpdate := model.Menu{"0x02", "name 1 changed", "", &[]model.Menu{mockParentMenu}, nil}
	mockOldMenu := model.Menu{"0x02", "name 1", "", &[]model.Menu{mockParentMenu}, nil}
	svc := NewMenuService(suite.mr)
	
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x02").Return(mockOldMenu, nil)
	suite.mr.On("Update", suite.mc, mockMenuToUpdate).Return(nil)

	result := svc.UpdateMenu(mockMenuToUpdate)

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *updateMenuTestSuite) TestHappyPathWithParentChangesOfNoneToNotNone() {
	mockParentMenu := model.Menu{"0x01", "parent 1", "", nil, nil}
	mockMenuToUpdate := model.Menu{"0x02", "name 1 changed", "", &[]model.Menu{mockParentMenu}, nil}
	mockOldMenu := model.Menu{"0x02", "name 1", "", nil, nil}
	svc := NewMenuService(suite.mr)
	
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x02").Return(mockOldMenu, nil)
	suite.mr.On("AddChild", suite.mc, "0x01", "0x02").Return(nil)
	suite.mr.On("Update", suite.mc, mockMenuToUpdate).Return(nil)

	result := svc.UpdateMenu(mockMenuToUpdate)

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *updateMenuTestSuite) TestHappyPathWithParentChangesOfNotNoneToNone() {
	mockParentMenu := model.Menu{"0x01", "parent 1", "", nil, nil}
	mockMenuToUpdate := model.Menu{"0x02", "name 1 changed", "", nil, nil}
	mockOldMenu := model.Menu{"0x02", "name 1", "", &[]model.Menu{mockParentMenu}, nil}
	svc := NewMenuService(suite.mr)
	
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x02").Return(mockOldMenu, nil)
	suite.mr.On("DeleteChild", suite.mc, "0x01", "0x02").Return(nil)
	suite.mr.On("DeleteParent", suite.mc, "0x02", "0x01").Return(nil)
	suite.mr.On("Update", suite.mc, mockMenuToUpdate).Return(nil)

	result := svc.UpdateMenu(mockMenuToUpdate)

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func (suite *updateMenuTestSuite) TestHappyPathwithParentChangesOfNotNoneToNotNone() {
	mockParentMenu1 := model.Menu{"0x01", "parent 1", "", nil, nil}
	mockParentMenu2 := model.Menu{"0x02", "parent 2", "", nil, nil}
	mockMenuToUpdate := model.Menu{"0x03", "name 1 changed", "", &[]model.Menu{mockParentMenu2}, nil}
	mockOldMenu := model.Menu{"0x03", "name 1", "", &[]model.Menu{mockParentMenu1}, nil}
	svc := NewMenuService(suite.mr)
	
	suite.mc.On("Dispose").Once()
	suite.mr.On("Context").Return(suite.mc).Once()
	suite.mr.On("Get", suite.mc, "0x03").Return(mockOldMenu, nil)
	suite.mr.On("DeleteChild", suite.mc, "0x01", "0x03").Return(nil)
	suite.mr.On("DeleteParent", suite.mc, "0x03", "0x01").Return(nil)
	suite.mr.On("AddChild", suite.mc, "0x02", "0x03").Return(nil)
	suite.mr.On("Update", suite.mc, mockMenuToUpdate).Return(nil)

	result := svc.UpdateMenu(mockMenuToUpdate)

	assert.Nil(suite.T(), result)
	suite.mc.AssertExpectations(suite.T())
	suite.mr.AssertExpectations(suite.T())
}

func TestRunAllMenuServiceTestSuites(t *testing.T) {
	suite.Run(t, new(getMenusTestSuite))
	suite.Run(t, new(createMenuTestSuite))
	suite.Run(t, new(deleteMenuTestSuite))
	suite.Run(t, new(updateMenuTestSuite))
}