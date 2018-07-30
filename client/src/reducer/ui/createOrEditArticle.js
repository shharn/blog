import { UI as UIActionType } from '../../action/types';

const initialState = {
    isEditMode: false,
    article: null
};

const reducer = (state = initialState, action) => {
    const { type } = action;
    switch(type) {
        case UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE:
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