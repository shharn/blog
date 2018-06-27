import Component from './HottestArticleList';
import { connect } from 'react-redux';
import { 
    requestDataWithURL
} from '../../action/data';

const mapStateToProps = (state, ownProps) => {
    const { data, error, fetchStatus, fetchComplete } = state.app.data.get.hottestArticles
    return {
        articles: data,
        error,
        fetchStatus,
        fetchComplete
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTheHottestArticles: () => dispatch(requestDataWithURL('hottestArticles', '/articles/hottest')),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);