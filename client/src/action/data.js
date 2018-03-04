import { data as dataActionType } from './types';

export const requestData = dataName => {
    return {
        type: dataActionType.REQUEST_GET_DATA,
        payload: {
            dataName
        }
    }
}

export const dataResponseFailed = (error, dataName) => {
    return {
        type: dataActionType.GET_DATA_RESPONSE_ERROR,
        payload: {
            error,
            dataName
        }
    }
}

export const dataResponseSuccess = (data, dataName) => {
    return {
        type: dataActionType.GET_DATA_RESPONSE_SUCCESS,
        payload: {
            data,
            dataName
        }
    }
}

export const dataMutationSuccess = (dataName, operationType) => {
    return {
        type: dataActionType.DATA_MUTATION_SUCCESS,
        payload: {
            dataName,
            operationType
        }
    }
}

export const dataMutationWait = () => {
    return {
        type: dataActionType.DATA_MUTATION_RESPONSE_WAIT
    }
}

export const dataMutationFail = (dataName, operationType) => {
    return {
        type: dataActionType.DATA_MUTATION_RESPONSE_ERROR,
        payload: {
            dataName,
            operationType
        }
    }
}

export const requestDataMutation = (operationType, data, dataName) => {
    return {
        type: dataActionType.REQUEST_MUTATE_DATA,
        payload: {
            operationType,
            data,
            dataName
        }
    }
}