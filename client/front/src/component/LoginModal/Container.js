// @flow
import { connect } from 'react-redux';
import Admin from './LoginModal';
import { 
    requestLogin, 
    initializeLoginStatus,
    requestOAuthLogin
} from '../../action/auth';
import { AuthPlatform } from '../../constant';
import type { 
    State,
    Dispatch,
    LoginInformation
} from '../../flowtype';

const mapStateToProps = (state: State): Object => {
    const { authStatus, error, isAuthenticated, authCodeURL } = state.app.auth;
    return {
        authStatus,
        error,
        isAuthenticated,
        authCodeURL
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    login: (loginInfo: LoginInformation): void => dispatch(requestLogin(loginInfo)),
    initializeAuthStatus: (): void => dispatch(initializeLoginStatus()),
    oauth: (platform: $Values<AuthPlatform>): void => dispatch(requestOAuthLogin(platform))
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);