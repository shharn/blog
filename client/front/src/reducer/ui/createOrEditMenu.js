// @flow`
import { UI as UIActionType } from '../../action/types';

import type {
    Menu
} from '../../flowtype';

import type {
    Action
} from '../../action/types';

export type CreateOrEditMenuState = {
    isEditMode: boolean,
    menu: ?Menu
};

const initialState = {
    isEditMode: false,
    menu: null
};

const reducer = (state: CreateOrEditMenuState = initialState, action: Action) => {
    const { type } = action;
    switch(type) {
        case UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT:
            return {
                ...state,
                isEditMode: false,
                menu: null
            };
        case UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_MENU:
            const { isEditMode, menu } = action.payload;
            return {
                ...state,
                isEditMode,
                menu
            };
        default:
            return state;
    }
};

export default reducer;