import { put, call, takeLatest } from 'redux-saga/effects'
import { 
    dataResponseSuccess, 
    dataResponseFailed,
    dataMutationSuccess,
    dataMutationFail
 } from '../action/data'
import { data as dataActionType } from '../action/types'
import { mutationOperationType } from '../constant'
import { 
    getData,
    createData,
    // updateData,
    // deleteData,
} from '../service'

function* dataGetRequestHandler(action) {
    const { dataName } = action.payload
    const response = yield call(getData, dataName)
    
    // yield put(dataResponseSuccess([
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    //     { Url: '/admin', Title: 'Admin'},
    // ], dataName));
    if (response.statusCode === 200) {
        yield put(dataResponseSuccess(response.body, dataName))
    } else {
        yield put(dataResponseFailed({
            statusCode: response.statusCode == null ? -1 : response.body.error.code,
            message: response.statusCode == null ? "Network is Offline. Check your network :(" : response.body.error.message
        }, dataName))
    }
}

function* dataMutationRequestHandler(action) {
    const { operationName, dataName, data, token } = action
    let response;
    switch(operationName) {
        case mutationOperationType.CREATE:
        response = yield call(createData, dataName, data, token)
        break
        case mutationOperationType.UPDATE:
        // response = yield call(updateData, dataName, data, token)
        break
        case mutationOperationType.DELETE:
        break
        default:
        break
    }
    if (response.statusCode === 200) {
        yield dataMutationSuccess(dataName, operationName)
    } else {
        yield dataMutationFail(dataName, operationName)
    }
}

export default function* watchDataRequest() {
    yield takeLatest(dataActionType.REQUEST_GET_DATA, dataGetRequestHandler)
    yield takeLatest(dataActionType.REQUEST_DATA_MUTATION, dataMutationRequestHandler)
}