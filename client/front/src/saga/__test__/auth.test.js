import  {
    put,
    call
} from 'redux-saga/effects';
import {
    processLogin,
    processTokenValidation,
    processLogout
} from '../auth';
import {
    requestLogin,
    validateToken,
    requestLogout
} from '../../service';
import { Token } from '../../constant';
import ls from 'local-storage';
import { cloneableGenerator } from 'redux-saga/utils';
import { Auth as AuthActionType } from '../../action/types';
import { 
    loginFailed, 
    loginSuccess,
    invalidToken,
    validToken,
    logoutSuccess,
    logoutFailed
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
        expect(next).toEqual({ done: true });
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
        expect(next).toEqual({ done: true });
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
        expect(next).toEqual({ done: true });
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
        expect(next).toEqual({ done: true });
    });

    test('If current network is online & valid token, should succeed', () => {
        const clone = gen.clone();
        const mockResponse = {
            status: 200,
            body: {
                isValid: true
            }
        };
        let next = clone.next(validateToken(mockToken));
        expect(next.value).toEqual(call(validateToken, mockToken));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(validToken()));

        next = clone.next();
        expect(next).toEqual({ done: true });
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
        expect(next).toEqual({ done: true });
    });
});

describe('Should handle REQUEST_LOGOUT', () => {
    const mockToken = 'testtoken';
    const gen = cloneableGenerator(processLogout)({
        type: AuthActionType.REQUEST_LOGOUT
    });

    beforeEach(() => {
        ls.set(Token.key, mockToken);
    });

    test(`Has no token`, () => {
        ls.remove(Token.key);
        const clone = gen.clone();
        let next = clone.next();
        expect(next.value).toEqual(put(logoutSuccess()));
        
        next = clone.next();
        expect(next).toEqual({ done: true });

        expect(ls.get(Token.key)).toBeNull();
    });

    test(`Network is offline`, () => {
        const clone = gen.clone();
        const mockResponse = {};
        
        let next = clone.next(requestLogout, mockToken);
        expect(next.value).toEqual(call(requestLogout, mockToken));

        next = clone.next(mockResponse);
        expect(next.value).toEqual(put(logoutFailed({ ...NETWORK_ERROR })));

        next = clone.next();
        expect(next).toEqual({ done: true });

        expect(ls.get(Token.key)).toBeNull();
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
        expect(next).toEqual({ done: true });

        expect(ls.get(Token.key)).toBeNull();
    });

    test(`Network is online, with invalid token`, () => {
        const clone = gen.clone();
        const mockMessage = 'Invalid Token'
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
        expect(next).toEqual({ done: true });

        expect(ls.get(Token.key)).toBeNull();
    });
});