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
import * as service from '../service';

import type { 
    Action
} from '../flowtype';
import type { Response } from 'superagent';


export function* processLogin(action: Action): Generator<Response | PutEffect, void, void> {
    const response: Response = yield call(service.requestLogin, action.payload.loginInfo);
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

export function* validateToken(action: Action): Generator<Response | PutEffect, void, void> {
    const { token } = action.payload;
    const response: Response = yield call(service.validateToken, token);
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

export function* processLogout(action: Action): Generator<Response | PutEffect, void, void> {
    LocalStorage.remove(Token.key);
    const exists: boolean = LocalStorage.get(Token.key) != null;
    if (exists) {
        yield put(logoutFailed({
            code: -1,
            message: 'Fail to logout. Retry later.'
        }));
    } else {
        yield put(logoutSuccess())
    }
}

export default function* watchLogin(): Generator<ForkEffect, void, void,> {
    yield takeLatest(AuthActionType.REQUEST_LOGIN, processLogin);
    yield takeLatest(AuthActionType.REQUEST_LOGOUT, processLogout);
    yield takeLatest(AuthActionType.VALIDATE_TOKEN, validateToken);
}
