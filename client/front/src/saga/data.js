import { 
    put, 
    call, 
    takeLatest, 
    PutEffect, 
    ForkEffect
} from 'redux-saga/effects';
import LocalStorage from 'local-storage';
import { 
    dataResponseSuccess, 
    dataResponseFailed,
    dataMutationSuccess,
    dataMutationFail,
    uploadImageSuccess,
    uploadImageFail
} from '../action/data';
import { Data as DataActionType } from '../action/types';
import { 
    MutationOperationType, 
    Token
} from '../constant';
import { 
    getData,
    getDataWithURL,
    createData,
    deleteData,
    updateData,
    uploadImage
} from '../service';
import { isNetworkOffline } from '../util';
import type { Action } from '../action/types';
import type { request } from 'superagent';

export function* dataGetRequestHandler(action: Action) : Generator<request.Response | PutEffect, void, void,> {
    const { dataName } = action.payload;
    const response: request.Response = yield call(getData, dataName);
    if (response.status === 200) {
        yield put(dataResponseSuccess(response.body, dataName));
    } else {
        yield put(dataResponseFailed({
            code: response.status == null ? -1 : response.status,
            message: response.status == null ? "Network is Offline :(" : response.body.message
        }, dataName));
    }
}

export function* dataGetRequestWithURLHandler(action: Action) : Generator<request.Response | PutEffect, void, void> {
    const { dataName, url } = action.payload;
    const urlWithoutLeadingSlash: string = url[0] === '/' ? url.substr(1) : url;
    const response: request.Response = yield call(getDataWithURL, urlWithoutLeadingSlash);
    if (response.status === 200) {
        yield put(dataResponseSuccess(response.body, dataName));
    } else {
        yield put(dataResponseFailed({ 
            code: response.status == null ? -1 : response.status,
            message: response.status == null ? "Network is Offline :(" : response.body.message
        }, dataName));
    }
}

export function* dataMutationRequestHandler(action: Action) : Generator<request.Response | PutEffect, void, null | PutEffect> {
    const { operationType, dataName, data } = action.payload;
    const token: string = LocalStorage.get(Token.key);
    if (!token || token.length < 1) {
        return put(dataMutationFail(dataName, operationType, {
            code: 401,
            message: 'Invalid token'
        }));
    }

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
    if (response.status === 200) {
        yield put(dataMutationSuccess(dataName, operationType, response.body));
    } else {
        yield put(dataMutationFail(dataName, operationType, {
                code: response.status == null ? -1 : response.status,
                message: response.status == null ? 'Network is Offline :(' : response.body.message
            }));
    }
}

export function* uploadImageRequestHandler(action: Action) : Generator<request.Response | PutEffect, void, null | PutEffect> {
    const { files } = action.payload;
    const token: string = LocalStorage.get(Token.key);
    if (!token || token.length < 1) {
        return put(uploadImageFail({
            code: 401,
            message: 'Invalid Token'
        }));
    }

    const response: request.Response = yield call(uploadImage, files, token);
    if (isNetworkOffline(response)) {
        return put(uploadImageFail({
            code: -1,
            message: 'Network is Offline :('
        }));
    }

    if (response.status === 200) {
        yield put(uploadImageSuccess());
    } else {
        yield put(uploadImageFail({
            code: response.status,
            message: response.body.message || 'Fail to upload images'
        }));
    }
}

export default function* watchDataRequest(): Generator<ForkEffect, void, void> {
    yield takeLatest(DataActionType.REQUEST_GET_DATA, dataGetRequestHandler);
    yield takeLatest(DataActionType.REQUEST_GET_DATA_WITH_URL, dataGetRequestWithURLHandler);
    yield takeLatest(DataActionType.REQUEST_MUTATE_DATA, dataMutationRequestHandler);
    yield takeLatest(DataActionType.UPLOAD_IMAGE, uploadImageRequestHandler);
}