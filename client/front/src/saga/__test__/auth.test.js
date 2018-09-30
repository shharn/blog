import {
    processLogin,
    validateToken,
    processLogout
} from '../auth';
import { Token } from '../../constant';
import ls from 'local-storage';
import { cloneableGenerator } from 'redux-saga/utils';
import { Auth as AuthActionType } from '../../action/types';

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
    const mockPayload = gen.next().value.CALL.args[0];
    test('If current network is offline, should put LOGIN_FAILED with network offline error', () => {
        const clone = gen.clone();
        const mockRequestLogin = jest.fn(_ => ({}));
        const response = clone.next(mockRequestLogin(mockPayload));
        const resultAction = response.value.PUT.action;
        const last = clone.next();

        expect(response.done).toBe(false);
        expect(resultAction.type).toBe(AuthActionType.LOGIN_FAILED);
        expect(resultAction.payload).toEqual({ error: { ...NETWORK_ERROR }});
        expect(last.done).toBe(true);
    });

    test('If current network is online and valid login information, should put LOGIN_SUCCESS action', () => {
        const clone = gen.clone();
        const mockResponseBody = { 
            isValid: true,
            token: 'testtoken'
        };
        const mockRequestLogin = jest.fn(_ => ({
            body: { ...mockResponseBody },
            status: 200
        }));
        const response = clone.next(mockRequestLogin(mockPayload));
        const resultAction = response.value.PUT.action;
        const last = clone.next();

        expect(response.done).toBe(false);
        expect(resultAction.type).toBe(AuthActionType.LOGIN_SUCCESS);
        expect(resultAction.payload).toEqual({  ...mockResponseBody });
        expect(last.done).toBe(true);
    });

    test('If current network is online and invalid login information, should put LOGIN_FAILED action', () => {
        const clone = gen.clone();
        const message = 'Invalid email or password';
        const mockResponseBody = {
            message
        };
        const mockRequestLogin = jest.fn(_ => ({
            body: { ...mockResponseBody },
            status: 401
        }));
        const response = clone.next(mockRequestLogin(mockPayload));
        const resultAction = response.value.PUT.action;
        const expectedPayload = {
            error: {
                code: 401,
                message
            }
        };
        const last = clone.next();

        expect(response.done).toBe(false);
        expect(resultAction.type).toBe(AuthActionType.LOGIN_FAILED);
        expect(resultAction.payload).toEqual(expectedPayload);
        expect(last.done).toBe(true);
    });
});

describe('Should handle VALIDATE_TOKEN in Saga', () => {
    const mockToken = 'testtoken';
    const gen = cloneableGenerator(validateToken)({
        type: AuthActionType.VALIDATE_TOKEN,
        payload: {
            token: mockToken
        }
    });
    gen.next();
    test('If current network is offline, put INVALID_TOKEN', () => {
        const clone = gen.clone();
        const mockValidateToken = jest.fn(_ => ({}));
        const response = clone.next(mockValidateToken(mockToken));
        const resultAction = response.value.PUT.action;
        const last = clone.next();

        expect(response.done).toBe(false);
        expect(resultAction.type).toBe(AuthActionType.INVALID_TOKEN);
        expect(resultAction.payload).toEqual({ error: { ...NETWORK_ERROR }});
        expect(last.done).toBe(true);
    });

    test('If current network is online & valid token, should succeed', () => {
        const clone = gen.clone();
        const mockValidateToken = jest.fn(_ => ({
            status: 200,
            body: {
                isValid: true
            }
        }));
        const response = clone.next(mockValidateToken(mockToken));
        const resultAction = response.value.PUT.action;
        const last = clone.next();

        expect(response.done).toBe(false);
        expect(resultAction.type).toBe(AuthActionType.VALID_TOKEN);
        expect(last.done).toBe(true);
    });

    test('If current network is online & invalid token, should put INVALID_TOKEN action with error', () => {
        const clone = gen.clone();
        const mockValidateToken = jest.fn(_ => ({
            status: 200,
            body: {
                isValid: false
            }
        }));
        const response = clone.next(mockValidateToken(mockToken));
        const resultAction = response.value.PUT.action;
        const last = clone.next();

        expect(response.done).toBe(false);
        expect(resultAction.type).toBe(AuthActionType.INVALID_TOKEN);
        expect(resultAction.payload).toEqual({
            error: {
                code: 403,
                message: 'Invalid Token'
            }
        });
        expect(last.done).toBe(true);
    });
});

describe('Should handle REQUEST_LOGOUT', () => {
    const mockToken = 'testtoken';
    const gen = cloneableGenerator(processLogout)({
        type: AuthActionType.REQUEST_LOGOUT
    });

    test(`Has no token`, () => {
        const clone = gen.clone();
        ls.remove(Token.key);
        const actualAction = clone.next().value.PUT.action;
        const last = clone.next();

        expect(actualAction.type).toBe(AuthActionType.LOGOUT_SUCCESS);
        expect(last.done).toBe(true);
    });

    test(`Network is offline`, () => {
        ls.set(Token.key, mockToken);
        const clone = gen.clone();
        clone.next();
        const mockRequestLogout = jest.fn(_ => ({}));
        const response = clone.next(mockRequestLogout(mockToken));
        const actualAction = response.value.PUT.action;
        const last = clone.next();

        expect(ls.get(Token.key)).toBeNull();
        expect(actualAction.type).toBe(AuthActionType.LOGOUT_FAILED);
        expect(actualAction.payload).toEqual({ error: { ...NETWORK_ERROR }});
        expect(last.done).toBe(true);
    });

    test(`Network is online`, () => {
        ls.set(Token.key, mockToken);
        const clone = gen.clone();
        clone.next();
        const mockRequestLogout = jest.fn(_ => ({
            status: 200
        }));
        const response = clone.next(mockRequestLogout(mockToken));
        const actualAction = response.value.PUT.action;
        const last = clone.next();

        expect(ls.get(Token.key)).toBeNull();
        expect(actualAction.type).toBe(AuthActionType.LOGOUT_SUCCESS);
        expect(last.done).toBe(true);
    });
});