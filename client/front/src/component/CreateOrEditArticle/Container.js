//@flow
import Component from './CreateOrEditArticle';
import { connect } from 'react-redux';
import {
    requestDataMutation
} from '../../action/data';
import { MutationOperationType } from '../../constant';
import { setDataForCreateOrEditArticle } from '../../action/ui';

const mapStateToProps = (state, ownProps) => {
    const { isEditMode, article } = { ...state.app.ui.createOrEditArticle };
    const fetchStatus = isEditMode ? state.app.data.mutation.articles.update : state.app.data.mutation.articles.create;
    return {
        menus: [ ...state.app.data.get.menus.data ],
        ...ownProps,
        isAuthenticated: state.app.auth.isAuthenticated,
        fetchStatus,
        isEditMode,
        article
    };
};

const mapDispatchToProps = dispatch => {
    return {
        submitNewArticle: (data: any) => dispatch(requestDataMutation(MutationOperationType.CREATE, data, 'articles')),
        submitUpdatedArticle: (data: any) => dispatch(requestDataMutation(MutationOperationType.UPDATE, data, 'articles')),
        initializeState: () => dispatch(setDataForCreateOrEditArticle(false, null))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);