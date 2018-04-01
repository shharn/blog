// @flow
import { Auth } from './types';

import type { LoginInformation, LoginResponse, BlogError } from '../flowtype'

export const initializeLoginStatus = () => ({
    type: Auth.INITIALISE_LOGIN_STATUS
})

export const requestLogin = (loginInfo : LoginInformation) => ({
    type: Auth.REQUEST_LOGIN,
    payload: {
        loginInfo
    }
})

export const loginSuccess = (loginResponse : LoginResponse) => ({
    type: Auth.LOGIN_SUCCESS,
    payload: loginResponse
})

export const loginFailed= (error: BlogError) => ({
    type: Auth.LOGIN_FAILED,
    payload: {
        error
    }
})

export const validateToken = (token: string) => ({
    type: Auth.VALIDATE_TOKEN,
    payload: {
        token
    }
})

export const validToken = () => ({
    type: Auth.VALID_TOKEN
})

export const invalidToken = (error: BlogError) => ({
    type: Auth.INVALID_TOKEN,
    payload: {
        error
    }
})

export const requestLogout = (token : string) => ({
    type: Auth.REQUEST_LOGOUT,
    payload: {
        token
    }
})

export const clientHasNoToken = () => ({
    type: Auth.CLINET_HAS_NO_TOKEN
})

export const logoutSuccess = () => ({
    type: Auth.LOGOUT_SUCCESS
})

export const logoutFailed = (error: BlogError) => ({
    type: Auth.LOGOUT_FAILED,
    payload: {
        error
    }
})