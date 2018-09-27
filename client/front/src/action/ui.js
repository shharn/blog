// @flow
import { UI as UIActionType } from './types';
import { MenuManagerChildComponentType } from '../constant';
import type { Action } from './types';
import type { 
    Menu,
    Article
} from '../flowtype';

export type OpenMenuManagementDialogAction = {
    type: UIActionType.OPEN_MENU_MANAGEMENT_DIALOG
};

export type CloseMenuManagementDialogAction = {
    type: UIActionType.CLOSE_MENU_MANAGEMENT_DIALOG
};

export type SwitchMenuManagerChildComponentAction = {
    type: UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT,
    payload: {
        childComponent: $Values<MenuManagerChildComponentType>
    }
};

export type ChangeToEditableCellAction = {
    type: UIActionType.CHANGE_EDITABLE_CELL,
    payload: {
        rowId: string,
        cellName: string
    }
};

export type DisableEditableCellAction = {
    type: UIActionType.DISABLE_EDITABLE_CELL
};

export type SetDataForCreateOrEditMenuAction = {
    type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_MENU,
    payload: {
        isEditMode: boolean,
        menu: Menu
    }
};

export type SetDataForCreateOrEditArticleAction = {
    type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE,
    payload: {
        isEditMode: boolean,
        article: Article
    }
};

export type UIAction = 
    OpenMenuManagementDialogAction |
    CloseMenuManagementDialogAction |
    SwitchMenuManagerChildComponentAction |
    ChangeToEditableCellAction |
    DisableEditableCellAction |
    SetDataForCreateOrEditMenuAction |
    SetDataForCreateOrEditArticleAction;

export const openMenuManagementDialog = (): Action => ({
    type: UIActionType.OPEN_MENU_MANAGEMENT_DIALOG
})

export const closeMenuManagementDialog = (): Action => ({
    type: UIActionType.CLOSE_MENU_MANAGEMENT_DIALOG
})

export const switchMenuManagerChildComponent = (childComponent: $Values<MenuManagerChildComponentType>): Action => ({
    type: UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT,
    payload: {
        childComponent
    }
})

export const changeToEditableCell = (rowId: number, cellName: string): Action => ({
    type: UIActionType.CHANGE_EDITABLE_CELL,
    payload: {
        rowId,
        cellName
    }
})

export const disableEditableCell = (): Action => ({
    type: UIActionType.DISABLE_EDITABLE_CELL
})

export const setDataForCreateOrEditMenu = (isEditMode: boolean, menu: ?Menu = null): Action => ({
    type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_MENU,
    payload: {
        isEditMode,
        menu
    }
});

export const setDataForCreateOrEditArticle = (isEditMode: boolean, article: ?Article = null): Action => ({
    type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE,
    payload: {
        isEditMode,
        article
    }
});
