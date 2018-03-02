import { ui as uiActionType } from './types';

export const openMenuManagementDialog = () => {
    return {
        type: uiActionType.OPEN_MENU_MANAGEMENT_DIALOG
    }
}

export const closeMenuManagementDialog = () => {
    return {
        type: uiActionType.CLOSE_MENU_MANAGEMENT_DIALOG
    }
}

export const changeToEditableCell = (rowId, cellName) => {
    return {
        type: uiActionType.CHANGE_EDITABLE_CELL,
        payload: {
            menuId: rowId,
            cellName
        }
    }
}

export const disableEditableCell = () => {
    return {
        type: uiActionType.DISABLE_EDITABLE_CELL
    }
}