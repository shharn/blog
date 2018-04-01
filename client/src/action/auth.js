// @flow
import { Auth } from './types';

import type { LoginInformation, LoginResponse, BlogError } from '../flowtype'

export const initializeLoginStatus = () => {
    return {
        type: Auth.INITIALISE_LOGIN_STATUS
    }
}

export const requestLogin = (loginInfo : LoginInformation) => {
    return {
        type: Auth.REQUEST_LOGIN,
        payload: {
            loginInfo
        }
    }
}

export const loginSuccess = (loginResponse : LoginResponse) => {
    return {
        type: Auth.LOGIN_SUCCESS,
        payload: loginResponse
    }
}

export const loginFailed= (error: BlogError) => {
    return {
        type: Auth.LOGIN_FAILED,
        payload: {
            error
        }
    }
}

export const validateToken = (token: string) => {
    return {
        type: Auth.VALIDATE_TOKEN,
        payload: {
            token
        }
    }
}

export const validToken = () => {
    return {
        type: Auth.VALID_TOKEN
    }
}

export const invalidToken = (error: BlogError) => {
    return {
        type: Auth.INVALID_TOKEN,
        payload: {
            error
        }
    }
}

export const requestLogout = (token : string) => {
    return {
        type: Auth.REQUEST_LOGOUT,
        payload: {
            token
        }
    }
}

export const clientHasNoToken = () => {
    return {
        type: Auth.CLINET_HAS_NO_TOKEN
    }
}

export const logoutSuccess = () => {
    return {
        type: Auth.LOGOUT_SUCCESS
    }
}

export const logoutFailed = (error: BlogError) => {
    return {
        type: Auth.LOGOUT_FAILED,
        payload: {
            error
        }
    }
}