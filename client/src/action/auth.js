// @flow
import { auth } from './types';

import type { LoginInformation, LoginResponse, BlogError } from '../flowtype'

export const initializeLoginStatus = () => {
    return {
        type: auth.INITIALISE_LOGIN_STATUS
    }
}

export const requestLogin = (loginInfo : LoginInformation) => {
    return {
        type: auth.REQUEST_LOGIN,
        payload: {
            loginInfo
        }
    }
}

export const loginSuccess = (loginResponse : LoginResponse) => {
    return {
        type: auth.LOGIN_SUCCESS,
        payload: loginResponse
    }
}

export const loginFailed= (error: BlogError) => {
    return {
        type: auth.LOGIN_FAILED,
        payload: {
            error
        }
    }
}

export const validateToken = (token: string) => {
    return {
        type: auth.VALIDATE_TOKEN,
        payload: {
            token
        }
    }
}

export const validToken = () => {
    return {
        type: auth.VALID_TOKEN
    }
}

export const invalidToken = (error: BlogError) => {
    return {
        type: auth.INVALID_TOKEN,
        payload: {
            error
        }
    }
}

export const requestLogout = (token : string) => {
    return {
        type: auth.REQUEST_LOGOUT,
        payload: {
            token
        }
    }
}

export const clientHasNoToken = () => {
    return {
        type: auth.CLINET_HAS_NO_TOKEN
    }
}

export const logoutSuccess = () => {
    return {
        type: auth.LOGOUT_SUCCESS
    }
}

export const logoutFailed = (error: BlogError) => {
    return {
        type: auth.LOGOUT_FAILED,
        payload: {
            error
        }
    }
}