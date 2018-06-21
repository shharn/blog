// @flow
import { Data as DataActionType } from './types';
import { FetchStatus } from '../constant';

import type { BlogError } from '../flowtype';

export const requestData = (dataName: string) => ({
    type: DataActionType.REQUEST_GET_DATA,
    payload: {
        dataName
    }
})

export const requestDataWithURL = (dataName: string, url: string) => ({
    type: DataActionType.REQUEST_GET_DATA_WITH_URL,
    payload: {
        dataName,
        url
    }
})

export const dataResponseFailed = (error: BlogError, dataName: string) => ({
    type: DataActionType.GET_DATA_RESPONSE_ERROR,
    payload: {
        error,
        dataName
    }
})

export const dataResponseSuccess = (data: any, dataName: string) => ({
    type: DataActionType.GET_DATA_RESPONSE_SUCCESS,
    payload: {
        data,
        dataName
    }
})

export const requestDataMutation = (operationType: string, data: any, dataName: string, token: string) => ({
    type: DataActionType.REQUEST_MUTATE_DATA,
    payload: {
        operationType,
        data,
        dataName,
        token
    }
})

export const dataMutationSuccess = (dataName: string, operationType: string, data: any) => ({
    type: DataActionType.DATA_MUTATION_SUCCESS,
    payload: {
        dataName,
        operationType,
        data
    }
})

export const dataMutationWait = () => ({
    type: DataActionType.DATA_MUTATION_RESPONSE_WAIT
})

export const dataMutationFail = (dataName: string, operationType: string, error: BlogError) => ({
    type: DataActionType.DATA_MUTATION_RESPONSE_ERROR,
    payload: {
        dataName,
        operationType,
        error
    }
})

export const changeMutationStatus = (dataName: string, operationType: string, statusToChange: $Values<FetchStatus>) => ({
    type: DataActionType.CHANGE_MUTATION_STATUS,
    payload: {
        dataName,
        operationType,
        statusToChange
    }
})

