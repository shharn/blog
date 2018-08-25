import Component from './ArticleDetail';
import { connect } from 'react-redux';
import { PLACEHOLDER_NAME_TO_CONVERT, FetchStatus } from '../../constant';
import { 
    requestDataWithNameAndURL,
    requestDataMutation,
    changeMutationStatus
} from '../../action/data';
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
        deleteFetchStatus
    };
};

const mapDispatchToProps = dispatch => ({
    getArticle: (articleName: string) => dispatch(requestDataWithNameAndURL(articleName, `article`, 'title', `/articles/${PLACEHOLDER_NAME_TO_CONVERT}`)),
    deleteArticle: (uid: string) => dispatch(requestDataMutation(MutationOperationType.DELETE, uid, DataName.ARTICLE)),
    initFetchStatus: () => dispatch(changeMutationStatus(DataName.ARTICLE, MutationOperationType.DELETE, FetchStatus.INITIAL))
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);