import { ui as uiActionType }  from '../action/types';

const initialState = {
    menuManager: {
        isDialogOpened: false,
        isEditable: false,
        editableRowId: null,
        editableCellName: null
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
        case uiActionType.CHANGE_EDITABLE_CELL:
            const { rowId, cellIndex} = action.payload;
            return {
                ...state,
                menuManager: {
                    ...state.menuManager,
                    isEditable: true,
                    editableRowId: rowId,
                    editableCellIndex: cellIndex
                }
            }
        case uiActionType.DISABLE_EDITABLE_CELL: 
            return {
                ...state,
                menuManager: {
                    ...state.menuManager,
                    isEditable: false,
                    editableRowId: null,
                    editableCellName: null
                }
            }
        default:
            return state;
    }
};

export default reducer;