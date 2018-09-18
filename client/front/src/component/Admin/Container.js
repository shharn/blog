import { connect } from 'react-redux';
import Admin from './Admin';
import { 
    requestLogin, 
    validateToken, 
    initializeLoginStatus
} from '../../action/auth';
import type { StoreState } from '../../';
import type { Dispatch} from '../../action/types';

const mapStateToProps = (state: StoreState): Object => {
    const { authStatus, error, isAuthenticated } = state.app.auth;
    return {
        authStatus,
        error,
        isAuthenticated
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    login: loginInfo => dispatch(requestLogin(loginInfo)),
    validateToken: token => dispatch(validateToken(token)),
    initializeLoginStatus: () => dispatch(initializeLoginStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);