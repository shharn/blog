import { connect} from 'react-redux';
import Admin from './Admin';
import { requestLogin, loginSuccess } from '../../action/auth';
import { loginStatus as loginStatusType } from '../../constant';

const mapStateToProps = (state, ownProps) => {
    return {
        loginStatus: state.app.auth.loginStatus || loginStatusType.INITIAL,
        error: state.app.auth.error
    };
};

const mapDispatchToProps = dispatch => ({
    login: loginInfo => dispatch(requestLogin(loginInfo)),
    changeLoginStatusToSuccess: token => dispatch(loginSuccess(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);