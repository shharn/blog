import Component from './MainArea';
import { connect } from 'react-redux';
import { 
    requestData,
    requestDataWithURL
} from '../../action/data';

const mapStateToProps = (store, ownProps) => {
    return {

    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTheHottestArticles: () => requestDataWithURL('hottestArticles', '/articles/hottest'),
        getArticlesOnMenu: (menuId: number) => requestDataWithURL(`articles-on-${menuId}`, `/menus/${menuId}/articles`)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
