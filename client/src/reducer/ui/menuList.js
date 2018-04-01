import { UI as UIActionType } from '../../action/ui';

const initialState = {
    isEditable: false,
    editableRowId: null,
    editableCellName: null
};

const reducer = (state = initialState, action) => {
    const { type } = action;
    switch (type){
        case UIActionType.CHANGE_EDITABLE_CELL:
            const { rowId, cellName} = action.payload;
            return {
                ...state,
                isEditable: true,
                editableRowId: rowId,
                editableCellName: cellName
            };
        case UIActionType.DISABLE_EDITABLE_CELL: 
            return {
                ...state,
                isEditable: false,
                editableRowId: null,
                editableCellName: null
            };
        default:
            return state;
    }
};

export default reducer;