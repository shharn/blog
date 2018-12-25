// @flow
import { 
    put, 
    call, 
    takeLatest, 
    PutEffect, 
    ForkEffect 
} from 'redux-saga/effects';
import { Auth as AuthActionType } from '../action/types';
import { 
    loginSuccess,
    loginFailed,
    logoutSuccess,
    logoutFailed, 
    invalidToken,
    validToken
} from '../action/auth';
import { Token } from '../constant';
import { isNetworkOffline } from '../util';
import LocalStorage from 'local-storage';
import {
    requestLogin,
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
        if (response.status === 200 && response.body.isValid === true) {
            yield put(validToken());
        } else {
            yield put(invalidToken({
                code: 401,
                message: 'Invalid Token'
            }));
        }
    }
}

export function* processLogout(action: Action): Generator<request.Response | PutEffect, void, null | PutEffect> {
    const token: string = LocalStorage.get(Token.key);
    if (!token || token.length < 1) {
        return put(logoutSuccess());
    }
    
    LocalStorage.remove(Token.key);
    const response: request.Response = yield call(requestLogout, token);
    if (isNetworkOffline(response)) {
        yield put(logoutFailed({
            code: -1,
            message: 'Network is offline :('
        }));
    } else {
        if (response.status === 200) {
            yield put(logoutSuccess());
        } else {
            yield put(logoutFailed({
                code: response.status,
                message: 'Fail to logout'
            }));
        }
    }
}

export default function* watchLogin(): Generator<ForkEffect, void, void,> {
    yield takeLatest(AuthActionType.REQUEST_LOGIN, processLogin);
    yield takeLatest(AuthActionType.REQUEST_LOGOUT, processLogout);
    yield takeLatest(AuthActionType.VALIDATE_TOKEN, processTokenValidation);
}
