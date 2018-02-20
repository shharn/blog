// @flow
import { auth } from './types';

// type BlogError = {
//     code: Number,
//     message: string
// };

export const requestLogin = (loginInfo) => {
    return {
        type: auth.REQUEST_LOGIN,
        payload: {
            loginInfo
        }
    }
}

export const loginSuccess = (token : string) => {
    return {
        type: auth.LOGIN_SUCCESS,
        payload: {
            token
        }
    }
}

export const loginFailed= (error) => {
    return {
        type: auth.LOGIN_FAILED,
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
        type: auth.CLIENT_HAS_NO_TOKEN
    }
}

export const logoutSuccess = () => {
    return {
        type: auth.LOGOUT_SUCCESS
    }
}

export const logoutFailed = (error) => {
    return {
        type: auth.LOGOUT_FAILED,
        payload: {
            error
        }
    }
}