import { connect} from 'react-redux';
import Admin from './Admin';
import { requestLogin, validateToken, initializeLoginStatus } from '../../action/auth';
import { loginStatus as loginStatusType } from '../../constant';

const mapStateToProps = (state, ownProps) => {
    return {
        loginStatus: state.app.auth.loginStatus || loginStatusType.INITIAL,
        error: state.app.auth.error,
        isAuthenticated: state.app.auth.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => ({
    login: loginInfo => dispatch(requestLogin(loginInfo)),
    validateToken: token => dispatch(validateToken(token)),
    initializeLoginStatus: () => dispatch(initializeLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);