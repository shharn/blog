// @flow
import { Auth as AuthActionType } from '../action/types'
import { AuthStatus, Token } from '../constant';
import LocalStorage from 'local-storage';
import type { ClientError } from '../flowtype';
import type { Action} from '../action/types';

export type AuthState = {
    authStatus: $Values<AuthStatus>,
    error: ClientError,
    isAuthenticated: boolean
};

const initialError: ClientError = {
    code: 0,
    message: ''
};

const initialState: AuthState = {
    authStatus: AuthStatus.INITIAL,
    error: initialError,
    isAuthenticated: false
};

const reducer = (state: AuthState = initialState, action: Action): AuthState => {
    let { type } = action;
    switch(type) {
        case AuthActionType.INITIALISE_LOGIN_STATUS:
            return {
                ...state,
                authStatus: AuthStatus.INITIAL
            };
        case AuthActionType.REQUEST_LOGIN:
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_WAIT
            };
        case AuthActionType.LOGIN_FAILED:
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_FAIL,
                isAuthenticated: false,
                error: action.payload.error
            };
        case AuthActionType.LOGIN_SUCCESS:
            action.payload.token && LocalStorage.set(Token.key, action.payload.token);
            return {
                ...state,
                isAuthenticated: action.payload.isValid,
                authStatus: AuthStatus.LOGIN_SUCCESS
            };
        case AuthActionType.VALIDATE_TOKEN: 
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_WAIT
            };
        case AuthActionType.VALID_TOKEN:
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_SUCCESS,
                isAuthenticated: true
            };
        case AuthActionType.INVALID_TOKEN:
            return {
                ...state,
                error: action.payload.error,
                authStatus: AuthStatus.LOGIN_INITIAL,
                isAuthenticated: false
            };
        case AuthActionType.REQUEST_LOGOUT:
            return {
                ...state,
                authStatus: AuthStatus.LOGOUT_WAIT
            };
        case AuthActionType.LOGOUT_SUCCESS:
            return {
                ...state,
                error: initialError,
                authStatus: AuthStatus.INITIAL,
                isAuthenticated: false
            };
        case AuthActionType.LOGOUT_FAIL:
            return {
                ...state,
                authStatus: AuthStatus.INITIAL,
                error: action.payload.error
            };
        default:
            return state;
    }
};

export default reducer;