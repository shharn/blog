// @flow
import { UI as UIActionType } from '../../action/types';

import type {
    Article,
} from '../../flowtype';

import type {
    Action
} from '../../action/types';

export type CreateOrEditArticleState = {
    isEditMode: boolean,
    article: ?Article
};

const initialState: CreateOrEditArticleState = {
    isEditMode: false,
    article: null
};

const reducer = (state:CreateOrEditArticleState = initialState, action: Action) => {
    const { type } = action;
    switch(type) {
        case UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE:
            const { isEditMode, article } = action.payload;
            return {
                ...state,
                isEditMode,
                article
            };
        default:
            return state;
    }
};

export default reducer;