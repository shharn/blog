import { put, call, takeLatest } from 'redux-saga/effects';
import { 
    dataResponseSuccess, 
    dataResponseFailed,
    dataMutationSuccess,
    dataMutationFail
 } from '../action/data';
import { Data as DataActionType } from '../action/types';
import { MutationOperationType } from '../constant';
import { 
    getData,
    createData,
    deleteData,
    updateData
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
            message: response.statusCode == null ? "Network is Offline. Check your network :(" : response.body
        }, dataName));
    }
}

function* dataMutationRequestHandler(action: BlogAction) : Generator<any, any, any> {
    const { operationType, dataName, data, token } = action.payload;
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

export default function* watchDataRequest(): Generator<any, any, any> {
    yield takeLatest(DataActionType.REQUEST_GET_DATA, dataGetRequestHandler);
    yield takeLatest(DataActionType.REQUEST_MUTATE_DATA, dataMutationRequestHandler);
}