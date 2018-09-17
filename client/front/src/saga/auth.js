// @flow
import { put, call, takeLatest } from 'redux-saga/effects';
import { Auth as AuthActionType } from '../action/types';
import { 
    loginSuccess,
    loginFailed,
    logoutSuccess,
    logoutFailed, 
    invalidToken,
    validToken
} from '../action/auth';
import { isNetworkOffline } from '../util';
import * as service from '../service';

import type { 
    Action
} from '../flowtype';


export function* processLogin(action: Action): Generator<any, any, any> {
    const response = yield call(service.requestLogin, action.payload.loginInfo);
    if (isNetworkOffline(response)) {
        // In this case, I think that using another action for 'net`work offline' is better idea
        // because more expressive / meaningful
        yield put(loginFailed({
            code: -1,
            message: 'Network is down (Server or Client) :('
        }));
    } else {
        if (response.statusCode === 200) {
            yield put(loginSuccess(response.body));
        } else {
            yield put(loginFailed({
                code: response.statusCode,
                message: response.body.message
            }));
        }
    }
}

export function* validateToken(action: Action): Generator<any, any, any> {
    const { token } = action.payload;
    const response = yield call(service.validateToken, token);
    if (isNetworkOffline(response)) {
        yield put(invalidToken({
            code: -1,
            message: 'Network is down :('
        }));
    } else {
        if (response.statusCode === 200 && response.body.isValid === true) {
            yield put(validToken());
        } else {
            yield put(invalidToken({
                code: response.statusCode,
                message: 'Invalid Token'
            }));
        }
    }
}

export function* processLogout(action: Action): Generator<any, any, any> {
    const { token } = action.payload;
    const { response } = yield call(service.requestLogout, token);
    if (response.error) {
        put(logoutFailed(response.error));
    } else {
        put(logoutSuccess())
    }
}

export default function* watchLogin(): Generator<any, any, any,> {
    yield takeLatest(AuthActionType.REQUEST_LOGIN, processLogin);
    yield takeLatest(AuthActionType.REQUEST_LOGOUT, processLogout);
    yield takeLatest(AuthActionType.VALIDATE_TOKEN, validateToken);
}
