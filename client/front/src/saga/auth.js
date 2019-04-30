// @flow
import { 
    put, 
    call, 
    take,
    takeLatest, 
    PutEffect, 
    ForkEffect 
} from 'redux-saga/effects';
import {
    eventChannel,
    END
} from 'redux-saga';
import { Auth as AuthActionType } from '../action/types';
import { 
    loginSuccess,
    loginFailed,
    logoutSuccess,
    logoutFailed, 
    invalidToken,
    validToken,
    oauthAuthorizationSuccess
} from '../action/auth';
import {
    Token,
    OAUTH_RESULT_LOCALSTORAGE_KEY
} from '../constant';
import { isNetworkOffline } from '../util';
import {
    requestLogin,
    requestOAuthAuthorization,
    validateToken,
    requestLogout
 } from '../service';
import type { Action } from '../flowtype';
import type { request } from 'superagent';

export function* processLogin(action: Action): Generator<request.Response | PutEffect, void, void> {
    const response: request.Response = yield call(requestLogin, action.payload.loginInfo);
    if (isNetworkOffline(response)) {
        yield put(loginFailed({
            code: -1,
            message: 'Network is offline :('
        }));
    } else {
        if (response.status === 200) {
            window.localStorage.setItem(Token.key, response.body.token);
            yield put(loginSuccess(response.body));
        } else {
            var message = response.body ? (response.body.message || 'Please try it later') : 'Please try it later';
            yield put(loginFailed({
                code: response.status,
                message
            }));
        }
    }
}

export function* processTokenValidation(action: Action): Generator<request.Response | PutEffect, void, void> {
    const { token } = action.payload;
    const response: request.Response = yield call(validateToken, token);
    if (isNetworkOffline(response)) {
        yield put(invalidToken({
            code: -1,
            message: 'Network is offline :('
        }));
    } else {
        if (response.status === 200 && response.body.isValid) {
            yield put(validToken(response.body));
        } else {
            window.localStorage.removeItem(Token.key);
            yield put(invalidToken({
                code: 401,
                message: 'Invalid Token'
            }));
        }
    }
}

export function* processLogout(action: Action): Generator<request.Response | PutEffect, PutEffect, null | PutEffect> {
    const token: string = window.localStorage.getItem(Token.key);
    if (!token || token.length < 1) {
        return put(logoutSuccess());
    }
    
    window.localStorage.removeItem(Token.key);
    const response: request.Response = yield call(requestLogout, token);
    if (isNetworkOffline(response)) {
        yield put(logoutFailed({
            code: -1,
            message: 'Network is offline :('
        }));
    } else {
        if (response.status === 200) {
            yield put(logoutSuccess());
        } else if (response.status === 401) {
            yield put(logoutFailed({
                code: response.status,
                message: 'Invalid Token'
            }));
        } else {
            yield put(logoutFailed({
                code: response.status,
                message: 'Fail to logout'
            }));
        }
    }
}

export function createStorageEventChannel() {
    return eventChannel(emit => {
        const storageEventListener = (e: StorageEvent) => {
            emit({
                key: e.key,
                payload: e.newValue
            });
            emit(END);
        };

        window.addEventListener('storage', storageEventListener);
        return () => window.removeEventListener('storage', storageEventListener);
    });
}

export function* processOAuthLogin(action: Action): Generator<request.Response | PutEffect, PutEffect, void> {
    const { platform } = action.payload;
    const response: request.Response = yield call(requestOAuthAuthorization, platform);
    if (isNetworkOffline(response)) {
        yield put(loginFailed({
            code: -1,
            message: 'Network is offline :('
        }));
        return;
    }

    if (response.status !== 200) {
        yield put(loginFailed({
            code: 400,
            message: 'Fail to oauth authorization'
        }));
        return;
    }

    let url: string = response.body.authCodeURL;
    yield put(oauthAuthorizationSuccess(url));

    const storageEventChannel = yield call(createStorageEventChannel);
    const result = yield take(storageEventChannel);
    if (!result) {
        yield put(loginFailed({
            code: 500,
            message: 'Unknown error occured during oauth authorization'
        }));
        return;
    }
    const { payload } = result;
    const parsedPayload = JSON.parse(payload);
    window.localStorage.removeItem(OAUTH_RESULT_LOCALSTORAGE_KEY);
    if (parsedPayload.isValid) {
        window.localStorage.setItem(Token.key, parsedPayload.token);
        yield put(loginSuccess(parsedPayload));
        return;
    }
    yield put(loginFailed({
        code: 400,
        message: 'Fail to get token from auth code'
    }));
}

export default function* watchLogin(): Generator<ForkEffect, void, void,> {
    yield takeLatest(AuthActionType.REQUEST_LOGIN, processLogin);
    yield takeLatest(AuthActionType.REQUEST_LOGOUT, processLogout);
    yield takeLatest(AuthActionType.VALIDATE_TOKEN, processTokenValidation);
    yield takeLatest(AuthActionType.REQUEST_OAUTH_LOGIN, processOAuthLogin);
}
