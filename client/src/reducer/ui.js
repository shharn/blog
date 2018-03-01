import { ui as uiActionType }  from '../action/types';

const initialState = {
    menuManager: {
        isDialogOpened: false
    }
};

const reducer = (state = initialState, action) => {
    const { type } = action;
    switch (type){
        case uiActionType.OPEN_MENU_MANAGEMENT_DIALOG:
            return {
                ...state,
                menuManager: {
                    ...state.menuManager,
                    isDialogOpened: true
                }
            };
        case uiActionType.CLOSE_MENU_MANAGEMENT_DIALOG:
            return {
                ...state,
                menuManager: {
                    ...state.menuManager,
                    isDialogOpened: false
                }
            };
        default:
            return state;
    }
};

export default reducer;