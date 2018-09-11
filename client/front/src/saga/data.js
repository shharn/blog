import { put, call, takeLatest } from 'redux-saga/effects';
import LocalStorage from 'local-storage';
import { 
    dataResponseSuccess, 
    dataResponseFailed,
    dataMutationSuccess,
    dataMutationFail,
    uploadImageSuccess,
    uploadImageFail,
    updateImageUploadProgress
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

import type { BlogAction } from '../action/data';

function* dataGetRequestHandler(action: BlogAction) : Generator<any, any, any,> {
    const { dataName } = action.payload;
    const response = yield call(getData, dataName);
    if (response.statusCode === 200) {
        yield put(dataResponseSuccess(response.body, dataName));
    } else {
        yield put(dataResponseFailed({
            code: response.statusCode == null ? -1 : response.statusCode,
            message: response.statusCode == null ? "Network is Offline. Check your network :(" : response.body.message
        }, dataName));
    }
}

function* dataGetRequestWithURLHandler(action: BlogAction) : Generator<any, any, any> {
    const { dataName, url } = action.payload;
    const urlWithoutLeadingSlash = url[0] === '/' ? url.substr(1) : url;
    const response = yield call(getDataWithURL, urlWithoutLeadingSlash);
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

function* dataMutationRequestHandler(action: BlogAction) : Generator<any, any, any> {
    const { operationType, dataName, data } = action.payload;
    const token = LocalStorage.get(Token.key);
    let response;
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
    } else {
        yield put(dataMutationFail(dataName, operationType, {
                code: response.statusCode == null ? -1 : response.statusCode,
                message: response.statusCode == null ? 'Network is Offline. Check your network :(' : response.body.message
            }));
    }
}

function* uploadImageRequestHandler(action: BlogAction) : Generator<any, any, any> {
    const { files } = action.payload;
    const token = LocalStorage.get(Token.key);
    let response = yield call(uploadImage, files, token);
    if (response.statusCode === 200) {
        yield put(uploadImageSuccess());
    } else {
        yield put(uploadImageFail());
    }
}

export default function* watchDataRequest(): Generator<any, any, any> {
    yield takeLatest(DataActionType.REQUEST_GET_DATA, dataGetRequestHandler);
    yield takeLatest(DataActionType.REQUEST_GET_DATA_WITH_URL, dataGetRequestWithURLHandler);
    yield takeLatest(DataActionType.REQUEST_MUTATE_DATA, dataMutationRequestHandler);
    yield takeLatest(DataActionType.UPLOAD_IMAGE, uploadImageRequestHandler);
}