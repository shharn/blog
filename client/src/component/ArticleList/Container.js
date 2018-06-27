import Component from './ArticleList';
import { connect} from 'react-redux';
import { 
    requestDataWithURL
} from '../../action/data';

const mapStateToProps = (state, ownProps) => {
    return {

    };
}

const mapDispatchToProps = dispatch => {
    return {
        getArticlesOnMenu: (menuId: number) => dispatch(requestDataWithURL(`articles-on-${menuId}`, `/menus/${menuId}/articles`))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);