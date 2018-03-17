// @flow
import { auth } from './types';

export type BlogError = {
    code: Number,
    message: string
};

export type LoginInformation = {
    email: string,
    password: string
}

type LoginResponse = {
    isAuthenticated: boolean,
    token: string
}

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

export const loginFailed= (error: AuthError) => {
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

export const invalidToken = (error: AuthError) => {
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

export const logoutFailed = (error: AuthError) => {
    return {
        type: auth.LOGOUT_FAILED,
        payload: {
            error
        }
    }
}