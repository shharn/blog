// @flow
import { Auth as AuthActionType } from '../action/types'
import { 
    AuthStatus,
    AuthPlatform,
    Token
} from '../constant';
import type { ClientError } from '../flowtype';
import type { Action} from '../action/types';

export type AuthState = {
    authStatus: $Values<AuthStatus>,
    error: ClientError,
    isAuthenticated: boolean,
    platform: $Values<AuthPlatform>,
    admin: boolean,
    authCodeURL: string
};

export const NO_ERROR: ClientError = {
    code: 0,
    message: ''
};

export const initialState: AuthState = {
    authStatus: AuthStatus.INITIAL,
    error: { ...NO_ERROR },
    isAuthenticated: false,
    platform: AuthPlatform.NONE,
    admin: false,
    authCodeURL: ''
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
        case AuthActionType.REQUEST_OAUTH_LOGIN:
            return {
                ...state,
                error: { ...NO_ERROR },
                authStatus: AuthStatus.LOGIN_WAIT,
                platform: action.payload.platform,
                isAuthenticated: false,
                admin: false
            };
        case AuthActionType.LOGIN_FAILED:
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_FAILED,
                isAuthenticated: false,
                error: action.payload.error,
                authCodeURL: ''
            };
        case AuthActionType.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: action.payload.isValid,
                platform: action.payload.platform,
                admin: action.payload.admin,
                authStatus: AuthStatus.LOGIN_SUCCESS,
                error: { ...NO_ERROR }
            };
        case AuthActionType.VALIDATE_TOKEN: 
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_WAIT,
                error: { ...NO_ERROR },
                isAuthenticated: false,
                admin: false
            };
        case AuthActionType.VALID_TOKEN:
            return {
                ...state,
                authStatus: AuthStatus.LOGIN_SUCCESS,
                error: { ...NO_ERROR },
                isAuthenticated: true,
                platform: action.payload.platform,
                admin: action.payload.admin
            };
        case AuthActionType.INVALID_TOKEN:
            return {
                ...state,
                authStatus: AuthStatus.INITIAL,
                isAuthenticated: false,
                admin: false,
                platform: AuthPlatform.NONE
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
                isAuthenticated: false,
                platform: AuthPlatform.NONE
            };
        case AuthActionType.LOGOUT_FAILED:
            const { error } = action.payload;
            return {
                ...state,
                error,
                authStatus: AuthStatus.INITIAL,
                isAuthenticated: false, // anyway change UI to logout button as if normally processed
                platform: AuthPlatform.NONE
            };
        case AuthActionType.OAUTH_AUTHORIZATION_SUCCESS:
            const { authCodeURL } = action.payload;
            return {
                ...state,
                authStatus: AuthStatus.OAUTH_AUTHORIZATION_SUCCESS,
                authCodeURL
            };
        default:
            return state;
    }
};

export default reducer;