// @flow
import { connect } from 'react-redux';
import Admin from './LoginModal';
import { 
    requestLogin, 
    validateToken, 
} from '../../action/auth';
import type { 
    State,
    Dispatch,
    LoginInformation
} from '../../flowtype';

const mapStateToProps = (state: State): Object => {
    const { authStatus, error, isAuthenticated } = state.app.auth;
    return {
        authStatus,
        error,
        isAuthenticated
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    login: (loginInfo: LoginInformation): void => dispatch(requestLogin(loginInfo)),
    validateToken: (token: string): void => dispatch(validateToken(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);