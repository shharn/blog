// @flow
import { UI as UIActionType } from '../../action/types';
import { MenuManagerChildComponentType } from '../../constant';

import type {
    Action
} from '../../action/types';

export type MenuManagerState = {
    isDialogOpened: boolean,
    childComponent: $Values<MenuManagerChildComponentType>
};

const initialState: MenuManagerState = {
    isDialogOpened: false,
    childComponent: MenuManagerChildComponentType.LIST
};

const reducer = (state: MenuManagerState = initialState, action: Action): MenuManagerState => {
    const { type } = action;
    switch (type){
        case UIActionType.OPEN_MENU_MANAGEMENT_DIALOG:
            return {
                ...state,
                isDialogOpened: true
            };
        case UIActionType.CLOSE_MENU_MANAGEMENT_DIALOG:
            return {
                ...state,
                isDialogOpened: false
            };
        case UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT:
            const { childComponent } = action.payload;
            return {
                ...state,
                childComponent
            };
        default:
            return state;
    }
};

export default reducer;