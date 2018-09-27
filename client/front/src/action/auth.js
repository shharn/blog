// @flow
import { Auth } from './types';
import type { Action } from './types';
import type { 
    LoginInformation, 
    LoginResponse, 
    ClientError 
} from '../flowtype';

export type InitializeLoginStatusAction = {
    type: Auth.INITIALISE_LOGIN_STATUS
};

export type RequestLoginAction = {
    type: Auth.REQUEST_LOGIN,
    payload: {
        loginInfo: LoginInformation
    }
};

export type LoginSuccessAction = {
    type: Auth.LOGIN_SUCCESS,
    payload: LoginResponse
};

export type LoginFailedAction = {
    type: Auth.LOGIN_FAILED,
    payload: {
        error: ClientError
    }
};

export type ValidateTokenAction = {
    type: Auth.VALIDATE_TOKEN,
    payload: {
        token: string
    }
};

export type ValidTokenAction = {
    type: Auth.VALID_TOKEN
};

export type InvalidTokenAction = {
    type: Auth.INVALID_TOKEN,
    payload: {
        error: ClientError
    }
};

export type RequestLogoutAction = {
    type: Auth.REQUEST_LOGOUT
};

export type LogoutSuccessAction = {
    type: Auth.LOGOUT_SUCCESS
};

export type LogoutFailedAction = {
    type: Auth.LOGOUT_FAILED,
    payload: {
        error: ClientError
    }
};

export type AuthAction = 
    InitializeLoginStatusAction |
    RequestLoginAction |
    LoginSuccessAction |
    LoginFailedAction |
    ValidateTokenAction |
    ValidTokenAction |
    InvalidTokenAction |
    RequestLogoutAction |
    LogoutSuccessAction |
    LogoutFailedAction;

export const initializeLoginStatus = (): Action => ({
    type: Auth.INITIALIZE_LOGIN_STATUS
})

export const requestLogin = (loginInfo : LoginInformation): Action=> ({
    type: Auth.REQUEST_LOGIN,
    payload: {
        loginInfo
    }
})

export const loginSuccess = (loginResponse : LoginResponse): Action => ({
    type: Auth.LOGIN_SUCCESS,
    payload: loginResponse
})

export const loginFailed= (error: ClientError): Action => ({
    type: Auth.LOGIN_FAILED,
    payload: {
        error
    }
})

export const validateToken = (token: string): Action => ({
    type: Auth.VALIDATE_TOKEN,
    payload: {
        token
    }
})

export const validToken = (): Action => ({
    type: Auth.VALID_TOKEN
})

export const invalidToken = (error: ClientError): Action => ({
    type: Auth.INVALID_TOKEN,
    payload: {
        error
    }
})

export const requestLogout = (): Action=> ({
    type: Auth.REQUEST_LOGOUT
})

export const logoutSuccess = (): Action => ({
    type: Auth.LOGOUT_SUCCESS
})

export const logoutFailed = (error: ClientError): Action => ({
    type: Auth.LOGOUT_FAILED,
    payload: {
        error
    }
})