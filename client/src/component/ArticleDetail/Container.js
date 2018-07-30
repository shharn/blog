import Component from './ArticleDetail';
import { connect } from 'react-redux';
import { PLACEHOLDER_NAME_TO_CONVERT } from '../../constant';
import { 
    requestDataWithNameAndURL
} from '../../action/data';

const mapStateToProps = (state, ownProps) => {
    return {
        
    };
};

const mapDispatchToProps = dispatch => ({
    getArticle: (articleName: string) => dispatch(requestDataWithNameAndURL(articleName, `articles`, 'title', `/articles/${PLACEHOLDER_NAME_TO_CONVERT}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);