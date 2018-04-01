import { UI as UIActionType }  from '../../action/types';
// import { combineReducers } from 'redux';
const initialState = {
    menuManager: {
        isDialogOpened: false,
        isEditable: false,
        editableRowId: null,
        editableCellIndex: null
    }
};

const reducer = (state = initialState, action) => {
    const { type } = action;
    switch (type){
        case UIActionType.CHANGE_EDITABLE_CELL:
            const { rowId, cellName} = action.payload;
            return {
                ...state,
                menuManager: {
                    ...state.menuManager,
                    isEditable: true,
                    editableRowId: rowId,
                    editableCellName: cellName
                }
            }
        case UIActionType.DISABLE_EDITABLE_CELL: 
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