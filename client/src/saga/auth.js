// @flow
import { put, call, takeLatest } from 'redux-saga/effects';
import { auth as authActionType } from '../action/types';
import { 
    loginSuccess,
    loginFailed,
    clientHasNoToken,
    logoutSuccess,
    logoutFailed, 
    invalidToken,
    validToken
} from '../action/auth';
import * as service from '../service';

type LoginError = {
    statusCode: Number,
    message: string
};

export function* loginProcess(action) {
    const response = yield call(service.requestLogin, action.payload.loginInfo);
    if (isNetworkOffline(response)) {
        // In this case, I think that using another action for 'network offline' is better idea
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
                message: response.body.errorMessage
            }));
        }
    }
}

export function* validateToken(action) {
    const { token } = action.payload;
    const response = yield call(service.validateToken, token);
    if (isNetworkOffline(response)) {
        yield put(invalidToken({
            code: -1,
            message: 'Network is down :('
        }));
    } else {
        if (response.statusCode === 200 && response.body.isAuthenticated === true) {
            yield put(validToken());
        } else {
            yield put(invalidToken({
                code: response.statusCode,
                message: 'Invalid Token'
            }));
        }
    }
}

export function* logoutProcess(action) {
    const { token } = action.payload;
    if (token) {
        // send request to server
        const { response } = yield call(service.requestLogout, token);
        // then, server check if exsits in the token server & delete from it
        // otherwise(no token exists in the token server), logout failure
        if (response.error) {
            put(logoutFailed(response.error));
        } else {
            put(logoutSuccess())
        }
    } else {
        put(clientHasNoToken());
    }
}

function isNetworkOffline(response) {
    return !response.status;
}

export default function* watchLogin() {
    yield takeLatest(authActionType.REQUEST_LOGIN, loginProcess);
    yield takeLatest(authActionType.REQUEST_LOGOUT, logoutProcess);
    yield takeLatest(authActionType.VALIDATE_TOKEN, validateToken);
}
