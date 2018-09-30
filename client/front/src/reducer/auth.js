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

const NO_ERROR: ClientError = {
    code: 0,
    message: ''
};

const initialState: AuthState = {
    authStatus: AuthStatus.INITIAL,
    error: { ...NO_ERROR },
    isAuthenticated: false
};

const reducer = (state: AuthState = initialState, action: Action): AuthState => {
    const { type } = action;
    switch(type) {
        case AuthActionType.INITIALIZE_LOGIN_STATUS:
            return {
                ...state,
                authStatus: AuthStatus.INITIAL,
                error: { ...NO_ERROR }
            };
        case AuthActionType.REQUEST_LOGIN:
            return {
                ...state,
                error: { ...NO_ERROR },
                authStatus: AuthStatus.LOGIN_WAIT
            };
        case AuthActionType.LOGIN_FAILED:
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_FAILED,
                isAuthenticated: false,
                error: action.payload.error
            };
        case AuthActionType.LOGIN_SUCCESS:
            action.payload.token && LocalStorage.set(Token.key, action.payload.token);
            return {
                ...state,
                isAuthenticated: action.payload.isValid,
                authStatus: AuthStatus.LOGIN_SUCCESS,
                error: { ...NO_ERROR }
            };
        case AuthActionType.VALIDATE_TOKEN: 
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_WAIT,
                error: { ...NO_ERROR },
                isAuthenticated: false,
            };
        case AuthActionType.VALID_TOKEN:
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_SUCCESS,
                error: { ...NO_ERROR },
                isAuthenticated: true
            };
        case AuthActionType.INVALID_TOKEN:
            LocalStorage.remove(Token.key);
            return {
                ...state,
                authStatus: AuthStatus.INITIAL,
                isAuthenticated: false
            };
        case AuthActionType.REQUEST_LOGOUT:
            return {
                ...state,
                authStatus: AuthStatus.LOGOUT_WAIT,
                error: { ...NO_ERROR }
            };
        case AuthActionType.LOGOUT_SUCCESS:
            return {
                ...state,
                error: { ...NO_ERROR },
                authStatus: AuthStatus.INITIAL,
                isAuthenticated: false
            };
        case AuthActionType.LOGOUT_FAILED:
            const { error } = action.payload;
            return {
                ...state,
                error,
                authStatus: AuthStatus.INITIAL,
                isAuthenticated: true
            };
        default:
            return state;
    }
};

export default reducer;