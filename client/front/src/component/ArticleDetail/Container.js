import Component from './ArticleDetail';
import { connect } from 'react-redux';
import { PLACEHOLDER_NAME_TO_CONVERT, FetchStatus } from '../../constant';
import { 
    requestDataWithNameAndURL,
    requestDataMutation,
    changeMutationStatus
} from '../../action/data';
import {
    setDataForCreateOrEditArticle
} from '../../action/ui';
import { 
    MutationOperationType,
    DataName
} from '../../constant';

const mapStateToProps = (state, ownProps) => {
    const { data: article, error, fetchStatus } =   { ...state.app.data.get.article };
    const deleteFetchStatus = state.app.data.mutation.articles.delete.status;
    const { isAuthenticated } = state.app.auth;
    return {
        article,
        error,
        fetchStatus,
        isAuthenticated,
        deleteFetchStatus,
        ...ownProps
    };
};

const mapDispatchToProps = dispatch => ({
    getArticle: articleName => dispatch(requestDataWithNameAndURL(articleName, `article`, 'title', `/articles/${PLACEHOLDER_NAME_TO_CONVERT}`)),
    deleteArticle: uid => dispatch(requestDataMutation(MutationOperationType.DELETE, uid, DataName.ARTICLE)),
    initFetchStatus: () => dispatch(changeMutationStatus(DataName.ARTICLE, MutationOperationType.DELETE, FetchStatus.INITIAL)),
    setArticleToEdit: article => dispatch(setDataForCreateOrEditArticle(true, article))
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);