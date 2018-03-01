import { put, call, takeLatest } from 'redux-saga/effects';
import { dataResponseSuccess, dataResponseFailed } from '../action/data';
import { data as dataActionType } from '../action/types';
import { getMenus } from '../service';

function* dataRequestHandler(action) {
    const { dataName } = action.payload;
    const response = yield call(getMenus);
    
    yield put(dataResponseSuccess([
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
        { Url: '/admin', Title: 'Admin'},
    ], dataName));
    // if (response.statusCode === 200) {
    //     yield put(dataResponseSuccess(response.body, dataName));
    // } else {
    //     yield put(dataResponseFailed({
    //         statusCode: response.statusCode,
    //         message: response.statusCode == null ? "Network is Offline. Check your network :(" : response.body.ErrorMessage
    //     }, dataName));
    // }
}

export default function* watchDataRequest() {
    yield takeLatest(dataActionType.REQUEST_DATA, dataRequestHandler);
}