import reducer, { initialState, NO_ERROR } from '../auth';
import { Auth as AuthActionType } from '../../action/types'
import { 
    AuthStatus,
    AuthPlatform
} from '../../constant';

describe('app.auth reducer test', () => {
    test('Should return the initial state', () => {
        const actual = reducer(undefined, {});
        const expected = { ...initialState };
        expect(actual).toEqual(expected);
    });

    describe('Should handle INITIALISE_LOGIN_STATUS', () => {
        test('LOGIN_SUCCUESS -> INITIALIZE_LOGIN_STATUS & leave "isAuthenticated" property as the same', () => {
            const initial = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_SUCCESS,
                isAuthenticated: true
            };
            const actual = reducer(initial, {
                type: AuthActionType.INITIALISE_LOGIN_STATUS
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_SUCCESS,
                isAuthenticated: true,
                platform: AuthPlatform.NONE
            };
            expect(actual).toEqual(expected);
        });

        test('LOGIN_FAILED -> INITIALIZE_LOGIN_STATUS', () => {
            const initial = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_FAILED
            };
            const actual = reducer(initial, {
                type: AuthActionType.INITIALIZE_LOGIN_STATUS
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.INITIAL,
                platform: AuthPlatform.NONE
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle REQUEST_LOGIN', () => {
        test('INITIAL -> REQUEST_LOGIN', () => {
            const actual = reducer(undefined, {
                type: AuthActionType.REQUEST_LOGIN,
                payload: {
                    platform: AuthPlatform.NATIVE
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT,
                platform: AuthPlatform.NATIVE
            };
            expect(actual).toEqual(expected);
        });

        test('The existing error should be cleaned', () => {
            const initial = {
                ...initialState,
                error: {
                    code: 500,
                    message: 'test error message'
                }
            };
            const actual = reducer(initial, {
                type: AuthActionType.REQUEST_LOGIN,
                payload: {
                    platform: AuthPlatform.NATIVE
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT,
                platform: AuthPlatform.NATIVE,
                isAuthenticated: false,
                admin: false
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle REQUEST_OAUTH_LOGIN', () => {
        test('INITIAL -> REQUEST_OAUTH_LOGIN', () => {
            const actual = reducer(undefined, {
                type: AuthActionType.REQUEST_OAUTH_LOGIN,
                payload: {
                    platform: AuthPlatform.FACEBOOK
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT,
                platform: AuthPlatform.FACEBOOK
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should hande LOGIN_FAILED', () => {
        test('LOGIN_WAIT -> LOGIN_FAILED', () => {
            const testError= { 
                code: 500,
                message: 'test error message'
            };
            const initial = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT
            };
            const actual = reducer(initial, {
                type: AuthActionType.LOGIN_FAILED,
                payload: {
                    error: { ...testError }
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_FAILED,
                error: { ...testError }
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle LOGIN_SUCCESS', () => {
        test('Should be in the authenticated state & store the token to local storage', () => {
            const initial = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT,
            };
            const tokenValue = 'testtoken';
            const actual = reducer(initial, {
                type: AuthActionType.LOGIN_SUCCESS,
                payload: {
                    token: tokenValue,
                    isValid: true,
                    platform: AuthPlatform.NATIVE,
                    admin: true
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_SUCCESS,
                isAuthenticated: true,
                platform: AuthPlatform.NATIVE,
                admin: true
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle VALIDATE_TOKEN', () => {
        test('The state should be "LOGIN_WAIT"', () => {
            const actual = reducer(undefined, {
                type: AuthActionType.VALIDATE_TOKEN
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT
            };
            expect(actual).toEqual(expected);
        });

        test('The existing error should be cleaned', () => {
            const initial = {
                ...initialState,
                error: { 
                    code: 500,
                    message: 'test error message'
                }
            };
            const mockToken = 'mocktoken';
            const actual = reducer(initial, {
                type: AuthActionType.VALIDATE_TOKEN,
                payload: {
                    token: mockToken
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT,
                error: { ...NO_ERROR }
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle VALID_TOKEN', () => {
        test('The state should be in authenticated state', () => {
            const initial = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT
            };
            const actual = reducer(initial, {
                type: AuthActionType.VALID_TOKEN,
                payload: {
                    admin: false,
                    platform: AuthPlatform.FACEBOOK
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_SUCCESS,
                isAuthenticated: true,
                platform: AuthPlatform.FACEBOOK
            };
            expect(actual).toEqual(expected);
        });
    });
    
    describe('Should handle INVALID_TOKEN', () => {
        test('The state should be in unauthenticated state', () => {
            const initial = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT
            };
            const actual = reducer(initial, {
                type: AuthActionType.INVALID_TOKEN,
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.INITIAL,
                isAuthenticated: false,
                platform: AuthPlatform.NONE
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle REQUEST_LOGOUT', () => {
        test('Should be in wait state', () => {
            const actual = reducer(undefined, {
                type: AuthActionType.REQUEST_LOGOUT,
                payload: {
                    platform: AuthPlatform.GITHUB
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.LOGOUT_WAIT
            };
            expect(actual, expected);
        });

        test('The existing error should be cleaned', () => {
            const initial = {
                ...initialState,
                error: {
                    code: 500,
                    message: 'test error message'
                }
            };
            const actual = reducer(initial, {
                type: AuthActionType.REQUEST_LOGOUT,
                payload: {
                    platform: AuthPlatform.NATIVE
                }
            });
            const expected = {
                ...initialState,
                error: { ...NO_ERROR },
                authStatus: AuthStatus.LOGOUT_WAIT
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle LOGOUT_SUCCESS', () => {
        test('Should be in initial state', () => {
            const initial = {
                ...initialState,
                isAuthenticated: true
            };
            const actual = reducer(initial, {
                type: AuthActionType.LOGOUT_SUCCESS
            });
            const expected = { ...initialState };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle LOGOUT_FAIL', () => {
        test('Should have error data & be in authenticated state', () => {
            const testError = {
                code: 500,
                message: 'test error message'
            };
            const initial = {
                ...initialState,
                authStatus: AuthStatus.LOGOUT_WAIT,
                isAuthenticated: true
            };
            const actual = reducer(initial, {
                type: AuthActionType.LOGOUT_FAILED,
                payload: {
                    error: { ...testError }
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.INITIAL,
                error: { ...testError },
                isAuthenticated: false
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle OAUTH_AUTHORIZATION_SUCCESS', () => {
        test('LOGIN_WAIT -> OAUTH_AUTHORIZATION_SUCCESS', () => {
            const mockAuthCodeURL = 'https://oauth2.com/authcodeURL?code=asdf';
            const initial = {
                ...initialState,
                authStatus: AuthStatus.LOGIN_WAIT,
                platform: AuthPlatform.GITHUB
            };
            const actual = reducer(initial, {
                type: AuthActionType.OAUTH_AUTHORIZATION_SUCCESS,
                payload: {
                    authCodeURL: mockAuthCodeURL
                }
            });
            const expected = {
                ...initialState,
                authStatus: AuthStatus.OAUTH_AUTHORIZATION_SUCCESS,
                platform: AuthPlatform.GITHUB,
                authCodeURL: mockAuthCodeURL
            };
            expect(actual).toEqual(expected);
        });
    });
});