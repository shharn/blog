import { UI as UIActionType } from '../../action/ui';

const initialState = {
    isDialogOpened: false,
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
        default:
            return state;
    }
}

export default reducer