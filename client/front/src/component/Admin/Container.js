import { connect } from 'react-redux';
import Admin from './Admin';
import { requestLogin, validateToken, initializeLoginStatus } from '../../action/auth';

import type { 
    StoreState
} from '../../';
import type { 
    Dispatch
} from '../../action/types';

const mapStateToProps = (state: StoreState) => {
    const { loginStatus, error, isAuthenticated } = state.app.auth;
    return {
        loginStatus,
        error,
        isAuthenticated
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    login: loginInfo => dispatch(requestLogin(loginInfo)),
    validateToken: token => dispatch(validateToken(token)),
    initializeLoginStatus: () => dispatch(initializeLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);