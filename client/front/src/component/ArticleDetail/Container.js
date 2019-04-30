import Component from './ArticleDetail';
import { connect } from 'react-redux';
import { 
    requestDataWithURL,
    requestDataMutation,
    initializeMutationStatus,
    changeServerRenderingFlag
} from '../../action/data';
import { setDataForCreateOrEditArticle } from '../../action/ui';
import { 
    MutationOperationType,
    DataName,
} from '../../constant';
import type { StoreState } from '../../';
import type { Dispatch } from '../../action/types';
import type { Article } from '../../constant';

const mapStateToProps = (state: StoreState): Object => {
    const { data: article, error, fetchStatus, isServerRendered } = { ...state.app.data.get.article };
    const deleteFetchStatus = state.app.data.mutation.articles.delete.status;
    const { isAuthenticated, admin } = state.app.auth;
    return {
        article,
        error,
        fetchStatus,
        isAuthenticated,
        admin,
        deleteFetchStatus,
        isServerRendered
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    getArticle: (uid: string) : void=> dispatch(requestDataWithURL('article', `/articles/${uid}`)),
    deleteArticle: (uid: string): void => dispatch(requestDataMutation(MutationOperationType.DELETE, uid, DataName.ARTICLE)),
    initDeleteFetchStatus: (): void => dispatch(initializeMutationStatus(DataName.ARTICLE, MutationOperationType.DELETE)),
    setArticleToEdit: (article: Article): void => dispatch(setDataForCreateOrEditArticle(true, article)),
    initServerRenderingFlag: () => dispatch(changeServerRenderingFlag(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);