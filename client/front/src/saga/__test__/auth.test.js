import  {
    put,
    call,
    take
} from 'redux-saga/effects';
import {
    processLogin,
    processTokenValidation,
    processLogout,
    processOAuthLogin,
    createStorageEventChannel
} from '../auth';
import {
    requestLogin,
    validateToken,
    requestLogout,
    requestOAuthAuthorization
} from '../../service';
import {
    Token,
    AuthPlatform
} from '../../constant';
import { cloneableGenerator } from 'redux-saga/utils';
import { Auth as AuthActionType } from '../../action/types';
import { 
    loginFailed, 
    loginSuccess,
    invalidToken,
    validToken,
    logoutSuccess,
    logoutFailed,
    oauthAuthorizationSuccess
} from '../../action/auth';

const NETWORK_ERROR = {
    code: -1,
    message: 'Network is offline :('
};

const MOCK_LOGININFO = {
    email: 'test@email.com',
    password: 'asdf'
};

describe('Should handle REQUEST_LOGIN in Saga', () => {
    const gen = cloneableGenerator(processLogin)({
        type: AuthActionType.REQUEST_LOGIN,
        payload: {
            loginInfo: { ...MOCK_LOGININFO }
        }
    });
    const mockPayload = { ...MOCK_LOGININFO };

    test('If current network is offline, should put LOGIN_FAILED with network offline error', () => {
        const clone = gen.clone();
        const mockResponse = {};
        
        let next = clone.next(requestLogin(mockPayload));
        expect(next.value).toEqual(call(requestLogin, mockPayload));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(loginFailed({ ...NETWORK_ERROR })));

        next = clone.next();
        expect(next.done).toBe(true);
    });

    test('If current network is online and valid login information, should put LOGIN_SUCCESS action', () => {
        const clone = gen.clone();
        const mockResponse = {
            status: 200, 
            body: {
                isValid: true,
                token: 'testtoken'
            }
        };

        let next = clone.next(requestLogin(mockPayload));
        expect(next.value).toEqual(call(requestLogin, mockPayload));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(loginSuccess(mockResponse.body)));

        next = clone.next();
        expect(next.done).toBe(true);
    });

    test('If current network is online and invalid login information, should put LOGIN_FAILED action', () => {
        const clone = gen.clone();
        const mockMessage = 'test error message';
        const mockResponse = {
            status: 401,
            body: {
                message: mockMessage
            }
        };
        
        let next = clone.next(requestLogin(mockPayload));
        expect(next.value).toEqual(call(requestLogin, mockPayload));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(loginFailed({
            code: 401,
            message: mockMessage
        })));

        next = clone.next();
        expect(next.done).toBe(true);
    });
});

describe('Should handle VALIDATE_TOKEN in Saga', () => {
    const mockToken = 'testtoken';
    const gen = cloneableGenerator(processTokenValidation)({
        type: AuthActionType.VALIDATE_TOKEN,
        payload: {
            token: mockToken
        }
    });

    test('If current network is offline, put INVALID_TOKEN', () => {
        const clone = gen.clone();
        const mockResponse = {};
        let next = clone.next(validateToken(mockToken));
        expect(next.value).toEqual(call(validateToken, mockToken));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(invalidToken({ ...NETWORK_ERROR })));

        next = clone.next();
        expect(next.done).toBe(true);
    });

    test('If current network is online & valid token, should succeed', () => {
        const clone = gen.clone();
        const mockResponse = {
            status: 200,
            body: {
                isValid: true,
                platform: AuthPlatform.GOOGLE,
                admin: false
            }
        };
        let next = clone.next(validateToken(mockToken));
        expect(next.value).toEqual(call(validateToken, mockToken));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(validToken({
            platform: mockResponse.body.platform,
            admin: mockResponse.body.admin
        })));

        next = clone.next();
        expect(next.done).toBe(true);
    });

    test('If current network is online & invalid token, should put INVALID_TOKEN action with error', () => {
        const clone = gen.clone();
        const mockResponse = {
            status: 200,
            body: {
                isValid: false
            }
        };
        let next = clone.next(validateToken(mockToken));
        expect(next.value).toEqual(call(validateToken, mockToken));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(invalidToken({
            code: 401,
            message: 'Invalid Token'
        })));

        next = clone.next();
        expect(next.done).toBe(true);
    });
});

describe('Should handle REQUEST_LOGOUT', () => {
    const mockToken = 'testtoken';
    const gen = cloneableGenerator(processLogout)({
        type: AuthActionType.REQUEST_LOGOUT
    });

    beforeEach(() => {
        window.localStorage.setItem(Token.key, mockToken);
    });

    test(`Has no token`, () => {
        window.localStorage.removeItem(Token.key);
        const clone = gen.clone();
        let next = clone.next();
        expect(next.value).toEqual(put(logoutSuccess()));
        
        next = clone.next();
        expect(next.done).toBe(true);

        expect(window.localStorage.getItem(Token.key)).toBeNull();
    });

    test(`Network is offline`, () => {
        const clone = gen.clone();
        const mockResponse = {};
        
        let next = clone.next(requestLogout, mockToken);
        expect(next.value).toEqual(call(requestLogout, mockToken));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(logoutFailed({ ...NETWORK_ERROR })));

        next = clone.next();
        expect(next.done).toBe(true);

        expect(window.localStorage.getItem(Token.key)).toBeNull();
    });

    test(`Network is online, with valid token`, () => {
        const clone = gen.clone();
        const mockResponse = {
            status: 200
        };
    
        let next = clone.next(requestLogout, mockToken);
        expect(next.value).toEqual(call(requestLogout, mockToken));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(logoutSuccess()));

        next = clone.next();
        expect(next.done).toBe(true);

        expect(window.localStorage.getItem(Token.key)).toBeNull();
    });

    test(`Network is online, with invalid token`, () => {
        const clone = gen.clone();
        const mockMessage = 'Invalid Token'
        const mockResponse = {
            status: 401,
            body: {
                message: mockMessage
            }
        };
    
        let next = clone.next(requestLogout, mockToken);
        expect(next.value).toEqual(call(requestLogout, mockToken));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(logoutFailed({
            code: 401,
            message: mockMessage
        })));

        next = clone.next();
        expect(next.done).toBe(true);

        expect(window.localStorage.getItem(Token.key)).toBeNull();
    });

    test(`Network is online, with invalid token`, () => {
        const clone = gen.clone();
        const mockMessage = 'Fail to logout'
        const mockResponse = {
            status: 500,
            body: {
                message: mockMessage
            }
        };
    
        let next = clone.next(requestLogout, mockToken);
        expect(next.value).toEqual(call(requestLogout, mockToken));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(logoutFailed({
            code: 500,
            message: mockMessage
        })));

        next = clone.next();
        expect(next.done).toBe(true);

        expect(window.localStorage.getItem(Token.key)).toBeNull();
    });
});

describe('Should handle REQUEST_OAUTH_LOGIN', () => {
    const mockPlatform = AuthPlatform.GITHUB;
    const gen = cloneableGenerator(processOAuthLogin)({
        type: AuthActionType.REQUEST_OAUTH_LOGIN,
        payload: {
            platform: mockPlatform
        }
    });

    test('Network is offline', () => {
        const clone = gen.clone();
        const mockResponse = {};

        let next = clone.next(requestOAuthAuthorization(mockPlatform));
        expect(next.value).toEqual(call(requestOAuthAuthorization, mockPlatform));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(loginFailed({ ...NETWORK_ERROR })));

        next = clone.next();
        expect(next.done).toBe(true);
    });

    test('Fail to authorize - empty platform variable', () => {
        const gen2 = processOAuthLogin({
            type: AuthActionType.REQUEST_OAUTH_LOGIN,
            payload: {
                platform: ''
            }
        });
        const mockResponse = {
            status: 400,
            message: 'Empty oauth2 platform'
        };

        let next = gen2.next(requestOAuthAuthorization(''));
        expect(next.value).toEqual(call(requestOAuthAuthorization, ''));

        next = gen2.next(mockResponse);
        expect(next.value).toEqual(put(loginFailed({
            code: 400,
            message: 'Fail to oauth authorization'
        })));

        next = gen2.next();
        expect(next.done).toBe(true);
    });

    test('Fail to authorize - unsupported platform variable', () => {
        const unsupportedPlatform = 'unsupported';
        const gen2 = processOAuthLogin({
            type: AuthActionType.REQUEST_OAUTH_LOGIN,
            payload: {
                platform: unsupportedPlatform
            }
        });
        const mockResponse = {
            status: 400,
            message: `Unsupported oauth2 platform - ${unsupportedPlatform}`
        };

        let next = gen2.next(requestOAuthAuthorization(unsupportedPlatform));
        expect(next.value).toEqual(call(requestOAuthAuthorization, unsupportedPlatform));

        next = gen2.next(mockResponse);
        expect(next.value).toEqual(put(loginFailed({
            code: 400,
            message: 'Fail to oauth authorization'
        })));

        next = gen2.next();
        expect(next.done).toBe(true);
    });

    test('Fail to get access token from api server', () => {
        const mockPlatform = AuthPlatform.GOOGLE;
        const mockAuthCodeURL = 'https://oauth2.com/auth?code=authCode';
        const gen2 = processOAuthLogin({
            type: AuthActionType.REQUEST_OAUTH_LOGIN,
            payload: {
                platform: mockPlatform
            }
        });
        const mockResponse = {
            status: 200,
            body: {
                authCodeURL: mockAuthCodeURL
            }
        };

        let next = gen2.next(requestOAuthAuthorization(mockPlatform));
        expect(next.value).toEqual(call(requestOAuthAuthorization, mockPlatform));

        next = gen2.next(mockResponse);
        expect(next.value).toEqual(put(oauthAuthorizationSuccess(mockAuthCodeURL)));

        const mockChannel = createStorageEventChannel();
        next = gen2.next(mockChannel);
        expect(next.value).toEqual(call(createStorageEventChannel));

        const mockStorageEventPayload = {
            payload: JSON.stringify({
                isValid: false,
                admin :false,
                token: ''
            })
        };
        next = gen2.next(mockChannel)
        expect(next.value).toEqual(take(mockChannel));
        
        next = gen2.next(mockStorageEventPayload);
        expect(next.value).toEqual(put(loginFailed({
            code: 400,
        message: 'Fail to get token from auth code'
        })));

        next = gen2.next();
        expect(next.done).toBe(true);
    });

    test('Happy path', () => {
        const mockPlatform = AuthPlatform.FACEBOOK;
        const mockToken = 'mock-token';
        const mockAuthCodeURL = 'https://oauth2.com/auth?code=authCode';
        const gen2 = processOAuthLogin({
            type: AuthActionType.REQUEST_OAUTH_LOGIN,
            payload: {
                platform: mockPlatform
            }
        });
        const mockResponse = {
            status: 200,
            body: {
                authCodeURL: mockAuthCodeURL
            }
        };

        let next = gen2.next(requestOAuthAuthorization(mockPlatform));
        expect(next.value).toEqual(call(requestOAuthAuthorization, mockPlatform));

        next = gen2.next(mockResponse);
        expect(next.value).toEqual(put(oauthAuthorizationSuccess(mockAuthCodeURL)));

        const mockChannel = createStorageEventChannel();
        next = gen2.next(mockChannel);
        expect(next.value).toEqual(call(createStorageEventChannel));

        const mockStorageEventPayload = {
            payload: JSON.stringify({
                isValid: true,
                admin :false,
                token: mockToken,
                platform: mockPlatform
            })
        };
        next = gen2.next(mockChannel)
        expect(next.value).toEqual(take(mockChannel));
        
        next = gen2.next(mockStorageEventPayload);
        expect(next.value).toEqual(put(loginSuccess({
            isValid: true,
            admin: false,
            token: mockToken,
            platform: mockPlatform
        })));

        next = gen2.next();
        expect(next.done).toBe(true);
    });
});