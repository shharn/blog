// @flow
import { UI as UIActionType } from '../../action/types';

import type {
    Action
} from '../../action/types';

export type MenuListState = {
    isEditable: boolean,
    editableRowId: ?string,
    editableCellName: ?string
};

const initialState: MenuListState = {
    isEditable: false,
    editableRowId: null,
    editableCellName: null
};

const reducer = (state: MenuListState = initialState, action: Action): MenuListState => {
    const { type } = action;
    switch (type){
        case UIActionType.CHANGE_EDITABLE_CELL:
            const { rowId, cellName } = action.payload;
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