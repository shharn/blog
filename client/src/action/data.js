import { data as dataActionType } from './types';

export const requestData = dataName => {
    return {
        type: dataActionType.REQUEST_DATA,
        payload: {
            dataName
        }
    }
}

export const dataResponseFailed = (error, dataName) => {
    return {
        type: dataActionType.RESPONSE_ERROR,
        payload: {
            error,
            dataName
        }
    }
}

export const dataResponseSuccess = (data, dataName) => {
    return {
        type: dataActionType.RESPONSE_SUCCESS,
        payload: {
            data,
            dataName
        }
    }
}