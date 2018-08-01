import Component from './ArticleDetail';
import { connect } from 'react-redux';
import { PLACEHOLDER_NAME_TO_CONVERT } from '../../constant';
import { 
    requestDataWithNameAndURL
} from '../../action/data';

const mapStateToProps = (state, ownProps) => {
    const { data: article, error, fetchStatus } =   { ...state.app.data.get.article };
    const { isAuthenticated } = state.app.auth;
    return {
        article,
        error,
        fetchStatus,
        isAuthenticated
    };
};

const mapDispatchToProps = dispatch => ({
    getArticle: (articleName: string) => dispatch(requestDataWithNameAndURL(articleName, `article`, 'title', `/articles/${PLACEHOLDER_NAME_TO_CONVERT}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);