import Component from './CreateArticle';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        menus: [ ...state.app.data.get.menus.data ],
        ...ownProps,
        isAuthenticated: state.app.auth.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);