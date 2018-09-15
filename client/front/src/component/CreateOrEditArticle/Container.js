//@flow
import Component from './CreateOrEditArticle';
import { connect } from 'react-redux';
import {
    requestDataMutation
} from '../../action/data';
import { MutationOperationType } from '../../constant';
import { setDataForCreateOrEditArticle } from '../../action/ui';

import type {
    StoreState
} from '../../';
import type {
    Dispatch
} from '../../action/types';

const mapStateToProps = (state: StoreState) => {
    const { isEditMode, article } = { ...state.app.ui.createOrEditArticle };
    const fetchStatus = isEditMode ? state.app.data.mutation.articles.update : state.app.data.mutation.articles.create;
    return {
        menus: [ ...state.app.data.get.menus.data ],
        isAuthenticated: state.app.auth.isAuthenticated,
        fetchStatus: fetchStatus.status,
        isEditMode,
        article
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        submitNewArticle: (data: any) => dispatch(requestDataMutation(MutationOperationType.CREATE, data, 'articles')),
        submitUpdatedArticle: (data: any) => dispatch(requestDataMutation(MutationOperationType.UPDATE, data, 'articles')),
        initializeState: () => dispatch(setDataForCreateOrEditArticle(false, null))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);