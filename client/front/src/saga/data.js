import { put, call, takeLatest, PutEffect, ForkEffect } from 'redux-saga/effects';
import LocalStorage from 'local-storage';
import { 
    dataResponseSuccess, 
    dataResponseFailed,
    dataMutationSuccess,
    dataMutationFail,
    uploadImageSuccess,
    uploadImageFail,
    requestData
 } from '../action/data';
import { Data as DataActionType } from '../action/types';
import { MutationOperationType, Token } from '../constant';
import { 
    getData,
    getDataWithURL,
    createData,
    deleteData,
    updateData,
    uploadImage
} from '../service';
import type { Action } from '../action/types';
import type { request } from 'superagent';

function* dataGetRequestHandler(action: Action) : Generator<request.Response | PutEffect, void, void,> {
    const { dataName } = action.payload;
    const response: request.Response = yield call(getData, dataName);
    if (response.statusCode === 200) {
        yield put(dataResponseSuccess(response.body, dataName));
    } else {
        yield put(dataResponseFailed({
            code: response.statusCode == null ? -1 : response.statusCode,
            message: response.statusCode == null ? "Network is Offline. Check your network :(" : response.body.message
        }, dataName));
    }
}

function* dataGetRequestWithURLHandler(action: Action) : Generator<request.Response | PutEffect, void, void> {
    const { dataName, url } = action.payload;
    const urlWithoutLeadingSlash: string = url[0] === '/' ? url.substr(1) : url;
    const response: request.Response = yield call(getDataWithURL, urlWithoutLeadingSlash);
    if (response.statusCode === 200) {
        yield put(dataResponseSuccess(response.body, dataName));
    } else {
        yield put(dataResponseFailed({ 
            // eslint-disable-next-line
            code: response.statusCode == null ? -1 : response.statusCode,
            message: response.statusCode == null ? "Network is Offline. Check your network :(" : response.body.message
        }, dataName));
    }
}

function* dataMutationRequestHandler(action: Action) : Generator<request.Response | PutEffect, void, void> {
    const { operationType, dataName, data } = action.payload;
    const token: string = LocalStorage.get(Token.key);
    let response: request.Response;
    switch(operationType) {
        case MutationOperationType.CREATE:
            response = yield call(createData, dataName, data, token);
            break;
        case MutationOperationType.UPDATE:
            response = yield call(updateData, dataName, data, token);
            break;
        case MutationOperationType.DELETE:
            response = yield call(deleteData, dataName, data, token);
            break;
        default:
            break;
    }
    if (response.statusCode === 200) {
        yield put(dataMutationSuccess(dataName, operationType, response.body));
        yield put(requestData(dataName));
    } else {
        yield put(dataMutationFail(dataName, operationType, {
                code: response.statusCode == null ? -1 : response.statusCode,
                message: response.statusCode == null ? 'Network is Offline. Check your network :(' : response.body.message
            }));
    }
}

function* uploadImageRequestHandler(action: Action) : Generator<request.Response | PutEffect, void, void> {
    const { files } = action.payload;
    const token: string = LocalStorage.get(Token.key);
    let response: request.Response = yield call(uploadImage, files, token);
    if (response.statusCode === 200) {
        yield put(uploadImageSuccess());
    } else {
        yield put(uploadImageFail());
    }
}

export default function* watchDataRequest(): Generator<ForkEffect, void, void> {
    yield takeLatest(DataActionType.REQUEST_GET_DATA, dataGetRequestHandler);
    yield takeLatest(DataActionType.REQUEST_GET_DATA_WITH_URL, dataGetRequestWithURLHandler);
    yield takeLatest(DataActionType.REQUEST_MUTATE_DATA, dataMutationRequestHandler);
    yield takeLatest(DataActionType.UPLOAD_IMAGE, uploadImageRequestHandler);
}