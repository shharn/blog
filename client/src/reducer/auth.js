import { Auth as AuthActionType } from '../action/types'
import { LoginStatus as LoginStatusType, Token } from '../constant';
import LocalStorage from 'local-storage';

const initialState = {
    loginStatus: LoginStatusType.INITIAL,
    error: null,
    isAuthenticated: false
};

const reducer = (state = initialState, action) => {
    let { type } = action;
    switch(type) {
        case AuthActionType.INITIALISE_LOGIN_STATUS:
            return {
                ...state,
                loginStatus: LoginStatusType.INITIAL
            }
        case AuthActionType.REQUEST_LOGIN:
            return {
                ...state,
                loginStatus: LoginStatusType.LOGIN_WAIT
            }
        case AuthActionType.LOGIN_FAILED:
            return {
                ...state,
                loginStatus: LoginStatusType.LOGIN_FAIL,
                isAuthenticated: false,
                error: action.payload.error
            }
        case AuthActionType.LOGIN_SUCCESS:
            action.payload.Token && LocalStorage.set(Token.key, action.payload.token);
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                loginStatus: LoginStatusType.LOGIN_SUCCESS
            }
        case AuthActionType.VALIDATE_TOKEN: 
            return {
                ...state,
                loginStatus: LoginStatusType.LOGIN_WAIT
            }
        case AuthActionType.VALID_TOKEN:
            return {
                ...state,
                loginStatus: LoginStatusType.LOGIN_SUCCESS,
                isAuthenticated: true
            }
        case AuthActionType.INVALID_TOKEN:
            return {
                ...state,
                error: action.payload.error,
                loginStatus: LoginStatusType.LOGIN_INITIAL,
                isAuthenticated: false
            }
        case AuthActionType.REQUEST_LOGOUT:
            return {
                ...state,
                logoutStatus: LoginStatusType.INITIAL
            }
        default:
            return state;
    }
}

export default reducer;