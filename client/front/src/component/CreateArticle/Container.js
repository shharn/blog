//@flow
import Component from './CreateArticle';
import { connect } from 'react-redux';
import {
    requestDataMutation
} from '../../action/data';
import { MutationOperationType } from '../../constant';

const mapStateToProps = (state, ownProps) => {
    const { status: createStatus } = state.app.data.mutation.articles.create;
    const { status: updateStatus } = state.app.data.mutation.articles.update;
    const { isEditMode, article } = { ...state.app.ui.createOrEditArticle };
    return {
        menus: [ ...state.app.data.get.menus.data ],
        ...ownProps,
        isAuthenticated: state.app.auth.isAuthenticated,
        createStatus,
        updateStatus,
        isEditMode,
        article
    };
};

const mapDispatchToProps = dispatch => {
    return {
        submitNewArticle: (data: any) => dispatch(requestDataMutation(MutationOperationType.CREATE, data, 'articles')),
        submitUpdatedArticle: (data: any) => dispatch(requestDataMutation(MutationOperationType.UPDATE, data, 'articles'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);