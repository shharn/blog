import { UI as UIActionType } from './types';
import { MenuManagerChildComponentType } from '../constant'

export const openMenuManagementDialog = () => {
    return {
        type: UIActionType.OPEN_MENU_MANAGEMENT_DIALOG
    }
}

export const closeMenuManagementDialog = () => {
    return {
        type: UIActionType.CLOSE_MENU_MANAGEMENT_DIALOG
    }
}

export const switchMenuManagerChildComponent = (showWhich: $Values<MenuManagerChildComponentType>, menu?: Menu = null) => {
    return {
        type: UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT,
        payload: {
            menu
        }
    }
}

export const changeToEditableCell = (rowId: number, cellName: string) => {
    return {
        type: UIActionType.CHANGE_EDITABLE_CELL,
        payload: {
            rowId,
            cellName
        }
    }
}

export const disableEditableCell = () => {
    return {
        type: UIActionType.DISABLE_EDITABLE_CELL
    }
}