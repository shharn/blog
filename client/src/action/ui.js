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