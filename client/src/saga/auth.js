// @flow
import { put, call, takeLatest } from 'redux-saga/effects';
import { auth as authActionType } from '../action/types';
import { 
    loginSuccess,
    loginFailed,
    clientHasNoToken,
    logoutSuccess,
    logoutFailed 
} from '../action/auth';
import * as service from '../service';

type LoginError = {
    statusCode: Number,
    message: string
};

export function* loginProcess(action) {
    const response = yield call(service.requestLogin, action.payload.loginInfo);
    if (response.statusCode === 200) {
        yield put(loginSuccess(response.body.Token));
    } else {
        yield put(loginFailed({
            code: response.statusCode,
            message: response.body.ErrorMessage
        }));
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

export default function* watchLogin() {
    yield takeLatest(authActionType.REQUEST_LOGIN, loginProcess);
    yield takeLatest(authActionType.REQUEST_LOGOUT, logoutProcess);
}