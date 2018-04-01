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
        case authActionType.INITIALISE_LOGIN_STATUS:
            return {
                ...state,
                loginStatus: LoginStatusType.INITIAL
            }
        case authActionType.REQUEST_LOGIN:
            return {
                ...state,
                loginStatus: LoginStatusType.LOGIN_WAIT
            }
        case authActionType.LOGIN_FAILED:
            return {
                ...state,
                loginStatus: LoginStatusType.LOGIN_FAIL,
                isAuthenticated: false,
                error: action.payload.error
            }
        case authActionType.LOGIN_SUCCESS:
            action.payload.Token && LocalStorage.set(Token.key, action.payload.token);
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                loginStatus: LoginStatusType.LOGIN_SUCCESS
            }
        case authActionType.VALIDATE_TOKEN: 
            return {
                ...state,
                loginStatus: LoginStatusType.LOGIN_WAIT
            }
        case authActionType.VALID_TOKEN:
            return {
                ...state,
                loginStatus: LoginStatusType.LOGIN_SUCCESS,
                isAuthenticated: true
            }
        case authActionType.INVALID_TOKEN:
            return {
                ...state,
                error: action.payload.error,
                loginStatus: LoginStatusType.LOGIN_INITIAL,
                isAuthenticated: false
            }
        case authActionType.REQUEST_LOGOUT:
            return {
                ...state,
                logoutStatus: LoginStatusType.INITIAL
            }
        default:
            return state;
    }
}

export default reducer;