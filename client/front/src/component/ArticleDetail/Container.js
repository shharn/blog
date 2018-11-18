import Component from './ArticleDetail';
import { connect } from 'react-redux';
import { 
    PLACEHOLDER_NAME_TO_CONVERT
} from '../../constant';
import { 
    requestDataWithNameAndURL,
    requestDataMutation,
    initializeMutationStatus,
    initializeData,
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

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    getArticle: (articleName: string) : void=> dispatch(requestDataWithNameAndURL(articleName, `article`, 'title', `/articles/${PLACEHOLDER_NAME_TO_CONVERT}`)),
    deleteArticle: (uid: string): void => dispatch(requestDataMutation(MutationOperationType.DELETE, uid, DataName.ARTICLE)),
    initDeleteFetchStatus: (): void => dispatch(initializeMutationStatus(DataName.ARTICLE, MutationOperationType.DELETE)),
    setArticleToEdit: (article: Article): void => dispatch(setDataForCreateOrEditArticle(true, article)),
    initArticleDatum: (): void => dispatch(initializeData('article'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);