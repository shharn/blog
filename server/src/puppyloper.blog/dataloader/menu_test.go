package dataloader_test

import (
	"fmt"
	"testing"

	"puppyloper.blog/data"
	"puppyloper.blog/dataloader"
)

// var (
// 	menus = data.Menus{
// 		1: data.Menu{ID: 1, Name: "Admin", URL: "/admin", ParentID: -1, ChildrenIDs: []int{4}},
// 		2: data.Menu{ID: 2, Name: "Home", URL: "/", ParentID: -1, ChildrenIDs: []int{}},
// 		3: data.Menu{ID: 3, Name: "Articles", URL: "/articles", ParentID: -1, ChildrenIDs: []int{}},
// 		4: data.Menu{ID: 4, Name: "Child1", URL: "/child1", ParentID: 1, ChildrenIDs: []int{}},
// 	}
// 	nextMenuID = 5
// )

func TestUpdateMenu(t *testing.T) {
	targetMenu := dataloader.CreateMenu(data.Menu{
		ID:          5,
		Name:        "Test Menu",
		URL:         "/testmenu",
		ParentID:    1,
		ChildrenIDs: []int{},
	})
	menus := dataloader.GetMenus()
	targetMenu.ParentID = 2
	dataloader.UpdateMenu(targetMenu)

	oldParentMenu := menus[1]
	if len(oldParentMenu.ChildrenIDs) != 1 {
		fmt.Println(oldParentMenu)
		t.Error("The oldParentMenu should have a child")
	}
	newParentMenu := menus[2]
	if len(newParentMenu.ChildrenIDs) != 1 && newParentMenu.ChildrenIDs[0] == 5 {
		fmt.Println(newParentMenu)
		t.Error("The newParentMenu has a child and it should be the menu which has ID 5")
	}
}
