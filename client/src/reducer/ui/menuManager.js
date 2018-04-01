import { UI as UIActionType } from '../../action/types';
import { MenuManagerChildComponentType } from '../../constant'

const initialState = {
    isDialogOpened: false,
    childComponent: MenuManagerChildComponentType.LIST
};

const reducer = (state = initialState, action) => {
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
}

export default reducer