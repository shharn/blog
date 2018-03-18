// @flow
import { data as dataActionType } from './types'
import { fetchStatus } from '../constant'

import type { BlogError } from '../flowtype'

export const requestData = (dataName: string) => {
    return {
        type: dataActionType.REQUEST_GET_DATA,
        payload: {
            dataName
        }
    }
}

export const dataResponseFailed = (error: BlogError, dataName: string) => {
    return {
        type: dataActionType.GET_DATA_RESPONSE_ERROR,
        payload: {
            error,
            dataName
        }
    }
}

export const dataResponseSuccess = (data: any, dataName: string) => {
    return {
        type: dataActionType.GET_DATA_RESPONSE_SUCCESS,
        payload: {
            data,
            dataName
        }
    }
}

export const requestDataMutation = (operationType: string, data: any, dataName: string, token: string) => {
    return {
        type: dataActionType.REQUEST_MUTATE_DATA,
        payload: {
            operationType,
            data,
            dataName,
            token
        }
    }
}

export const dataMutationSuccess = (dataName: string, operationType: string, data: any) => {
    return {
        type: dataActionType.DATA_MUTATION_SUCCESS,
        payload: {
            dataName,
            operationType,
            data
        }
    }
}

export const dataMutationWait = () => {
    return {
        type: dataActionType.DATA_MUTATION_RESPONSE_WAIT
    }
}

export const dataMutationFail = (dataName: string, operationType: string, error: BlogError) => {
    return {
        type: dataActionType.DATA_MUTATION_RESPONSE_ERROR,
        payload: {
            dataName,
            operationType,
            error
        }
    }
}

export const changeMutationStatus = (dataName: string, operationType: string, statusToChange: $Values<fetchStatus>) => {
    return {
        type: dataActionType.CHANGE_MUTATION_STATUS,
        payload: {
            dataName,
            operationType,
            statusToChange
        }
    }
}

