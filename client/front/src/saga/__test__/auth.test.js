import {
    processLogin,
    validateToken,
    processLogout
} from '../auth';
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
        const last = clone.next();

        expect(response.done).toBe(false);
        expect(response.value.PUT.action.payload).toEqual({ error: { ...NETWORK_ERROR }});
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
        const actualPayload = response.value.PUT.action.payload;
        const last = clone.next();

        expect(response.done).toBe(false);
        expect(actualPayload).toEqual({  ...mockResponseBody });
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
        const actualPayload = response.value.PUT.action.payload;
        const expectedPayload = {
            error: {
                code: 401,
                message
            }
        };
        const last = clone.next();

        expect(response.done).toBe(false);
        expect(actualPayload).toEqual(expectedPayload);
        expect(last.done).toBe(true);
    });
});

describe('Should handle VALIDATE_TOKEN in Saga', () => {
    test('If current network is offline, put INVALID_TOKEN', () => {

    });
});

describe('Should handle REQUEST_LOGOUT', () => {
    test('If current network is offline, put LOGOUT_FAILED with error', () => {

    });
});