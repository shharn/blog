import { UI as UIActionType } from './types';
import { MenuManagerChildComponentType } from '../constant';

export const openMenuManagementDialog = () => ({
    type: UIActionType.OPEN_MENU_MANAGEMENT_DIALOG
})

export const closeMenuManagementDialog = () => ({
    type: UIActionType.CLOSE_MENU_MANAGEMENT_DIALOG
})

export const switchMenuManagerChildComponent = (childComponent: $Values<MenuManagerChildComponentType>) => ({
    type: UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT,
    payload: {
        childComponent
    }
})

export const changeToEditableCell = (rowId: number, cellName: string) => ({
    type: UIActionType.CHANGE_EDITABLE_CELL,
    payload: {
        rowId,
        cellName
    }
})

export const disableEditableCell = () => ({
    type: UIActionType.DISABLE_EDITABLE_CELL
})

export const setDataForCreateOrEditMenu = (isEditMode: boolean, menu: Menu = null) => ({
    type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_MENU,
    payload: {
        isEditMode,
        menu
    }
})