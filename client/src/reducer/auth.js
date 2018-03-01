import { auth as authActionType } from '../action/types'
import { loginStatus as loginStatusType, token } from '../constant';
import LocalStorage from 'local-storage';

const initialState = {
    loginStatus: loginStatusType.INITIAL
};

const reducer = (state = initialState, action) => {
    let { type } = action;
    switch(type) {
        case authActionType.INITIALISE_LOGIN_STATUS:
            return {
                ...state,
                loginStatus: loginStatusType.INITIAL
            }
        case authActionType.REQUEST_LOGIN:
            return {
                ...state,
                loginStatus: loginStatusType.LOGIN_WAIT
            }
        case authActionType.LOGIN_FAILED:
            return {
                ...state,
                loginStatus: loginStatusType.LOGIN_FAIL,
                isAuthenticated: false,
                error: action.payload.error
            }
        case authActionType.LOGIN_SUCCESS:
            action.payload.token && LocalStorage.set(token.key, action.payload.token);
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                loginStatus: loginStatusType.LOGIN_SUCCESS
            }
        case authActionType.VALIDATE_TOKEN: 
            return {
                ...state,
                loginStatus: loginStatusType.LOGIN_WAIT
            }
        case authActionType.VALID_TOKEN:
            return {
                ...state,
                loginStatus: loginStatusType.LOGIN_SUCCESS,
                isAuthenticated: true
            }
        case authActionType.INVALID_TOKEN:
            return {
                ...state,
                error: action.payload.error,
                loginStatus: loginStatusType.LOGIN_INITIAL,
                isAuthenticated: false
            }
        case authActionType.REQUEST_LOGOUT:
            return {
                ...state,
                logoutStatus: loginStatusType.INITIAL
            }
        default:
            return state;
    }
}

export default reducer;