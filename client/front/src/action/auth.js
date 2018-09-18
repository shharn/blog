// @flow
import { Auth } from './types';
import type { LoginInformation, LoginResponse, ClientError } from '../flowtype';
import type { Action } from './types';

export const initializeLoginStatus = (): Action => ({
    type: Auth.INITIALISE_LOGIN_STATUS
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

export const requestLogout = (token : string): Action=> ({
    type: Auth.REQUEST_LOGOUT,
    payload: {
        token
    }
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