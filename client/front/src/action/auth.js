// @flow
import { Auth } from './types';
import { AuthPlatform } from '../constant';
import type { Action } from './types';
import type { 
    LoginInformation, 
    LoginResponse, 
    ClientError 
} from '../flowtype';

export const initializeLoginStatus = (): Action => ({
    type: Auth.INITIALIZE_LOGIN_STATUS
})

export const requestLogin = (loginInfo : LoginInformation): Action=> ({
    type: Auth.REQUEST_LOGIN,
    payload: {
        loginInfo,
        platform: AuthPlatform.NATIVE
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

export const validToken = (validResponse: { platform: $Values<AuthPlatform>, admin: boolean }): Action => ({
    type: Auth.VALID_TOKEN,
    payload: {
        platform: validResponse.platform,
        admin: validResponse.admin
    }
})

export const invalidToken = (error: ClientError): Action => ({
    type: Auth.INVALID_TOKEN,
    payload: {
        error
    }
})

export const requestLogout = (): Action => ({
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

export const requestOAuthLogin = (platform: $Values<AuthPlatform>): Action => ({
    type: Auth.REQUEST_OAUTH_LOGIN,
    payload: {
        platform
    }
})

export const oauthAuthorizationSuccess = (authCodeURL: string): Action => ({
    type: Auth.OAUTH_AUTHORIZATION_SUCCESS,
    payload: {
        authCodeURL
    }
})
