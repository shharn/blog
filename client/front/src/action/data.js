// @flow
import { Data as DataActionType } from './types';
import type { Action } from './types';
import type { ClientError } from '../flowtype';

export type RequestDataAction = {
    type: DataActionType.REQUEST_GET_DATA,
    payload: {
        dataName: string
    }
};

export type RequestDataWithURLAction = {
    type: DataActionType.REQUEST_GET_DATA_WITH_URL,
    payload: {
        dataName: string,
        url: string
    }
};

export type RequestDataWithNameAndURLAction = {
    type: DataActionType.REQUEEST_GET_DATA_WITH_NAME_AND_URL,
    paylod: {
        name: string,
        dataName: string,
        propName: string,
        url: string
    }
};

export type DataResponseFailedAction = {
    type: DataActionType.GET_DATA_RESPONSE_ERROR,
    payload: {
        error: ClientError,
        dataName: string
    }
};

export type DataResponseSuccessAction = {
    type: DataActionType.GET_DATA_RESPONSE_SUCCESS,
    payload: {
        data: mixed,
        dataName: string
    }
};


export type RequestDataMutationAction = {
    type: DataActionType.REQUEST_MUTATE_DATA,
    payload: {
        operationType: string,
        dataName: string,
        data: mixed
    }
};

export type DataMutationSuccessAction = {
    type: DataActionType.DATA_MUTATION_SUCCESS,
    payload: {
        dataName: string,
        operationType: string,
        data: mixed
    }
};

export type DataMutationWaitAction = {
    type: DataActionType.DATA_MUTATION_RESPONSE_WAIT
};

export type DataMutationFailAction = {
    type: DataActionType.DATA_MUTATION_FAIL,
    payload: {
        dataName: string,
        operationType: string,
        error: ClientError
    }
};

export type InitializeMutationStatusAction = {
    type: DataActionType.INITIALIZE_MUTATION_STATUS,
    payload: {
        dataName: string,
        operationType: string
    }
};

export type UploadImageAction = {
    type: DataActionType.UPLOAD_IMAGE,
    payload: {
        files: Array<File>
    }
};

export type UploadImageSuccessAction = {
    type: DataActionType.UPLOAD_IMAGE_SUCCESS
};

export type UploadImageFailAction = {
    type: DataActionType.UPLOAD_IMAGE_FAIL,
    payload: {
        error: ClientError
    }
};

export type InitializeImageDialogStatusAction = {
    type: DataActionType.INITIALIZE_IMAGE_DIALOG_STATUS
};

export type SetDataAction = {
    type: DataActionType.SET_DATA,
    payload: {
        dataName: string,
        data: Object
    }
};

export type DataAction = 
    RequestDataAction |
    RequestDataWithURLAction |
    RequestDataWithNameAndURLAction |
    DataResponseFailedAction |
    DataResponseSuccessAction |
    RequestDataMutationAction |
    DataMutationSuccessAction |
    DataMutationWaitAction |
    DataMutationFailAction |
    InitializeMutationStatusAction |
    UploadImageAction |
    UploadImageSuccessAction |
    UploadImageFailAction |
    InitializeImageDialogStatusAction |
    SetDataAction;

export const requestData = (dataName: string): Action => ({
    type: DataActionType.REQUEST_GET_DATA,
    payload: {
        dataName
    }
})

export const requestDataWithURL = (dataName: string, url: string): Action => ({
    type: DataActionType.REQUEST_GET_DATA_WITH_URL,
    payload: {
        dataName,
        url
    }
})

export const requestDataWithNameAndURL = (name: string, dataName: string, propName: string, url: string): Action => ({
    type: DataActionType.REQUEST_GET_DATA_WITH_NAME_AND_URL,
    payload: {
        name,
        dataName,
        propName,
        url
    }
})

export const dataResponseFailed = (error: ClientError, dataName: string): Action => ({
    type: DataActionType.GET_DATA_RESPONSE_ERROR,
    payload: {
        error,
        dataName
    }
})

export const dataResponseSuccess = (data: any, dataName: string): Action => ({
    type: DataActionType.GET_DATA_RESPONSE_SUCCESS,
    payload: {
        data,
        dataName
    }
})

export const requestDataMutation = (operationType: string, data: any, dataName: string): Action => ({
    type: DataActionType.REQUEST_MUTATE_DATA,
    payload: {
        operationType,
        data,
        dataName,
    }
})

export const dataMutationSuccess = (dataName: string, operationType: string, data: any): Action => ({
    type: DataActionType.DATA_MUTATION_SUCCESS,
    payload: {
        dataName,
        operationType,
        data
    }
})

export const dataMutationWait = (): Action => ({
    type: DataActionType.DATA_MUTATION_RESPONSE_WAIT
})

export const dataMutationFail = (dataName: string, operationType: string, error: ClientError): Action => ({
    type: DataActionType.DATA_MUTATION_FAIL,
    payload: {
        dataName,
        operationType,
        error
    }
})

export const initializeMutationStatus = (dataName: string, operationType: string): Action => ({
    type: DataActionType.INITIALIZE_MUTATION_STATUS,
    payload: {
        dataName,
        operationType
    }
});

export const uploadImage = (files: Array<File>): Action => ({
    type: DataActionType.UPLOAD_IMAGE,
    payload: {
        files
    }
});

export const uploadImageSuccess = (): Action => ({
    type: DataActionType.UPLOAD_IMAGE_SUCCESS
});

export const uploadImageFail = (error: ClientError): Action => ({
    type: DataActionType.UPLOAD_IMAGE_FAIL,
    payload: {
        error
    }
});

export const initializeImageDialogStatus = (): Action => ({
    type: DataActionType.INITIALIZE_IMAGE_DIALOG_STATUS
});

export const initializeData = (dataName: string): Action => ({
    type: DataActionType.INITIALIZE_DATA,
    payload: {
        dataName
    }
});

export const changeServerRenderingFlag = (maybeFalse: boolean): Action => ({
    type: DataActionType.INITIALIZE_SERVER_RENDERING_FLAG,
    payload: {
        maybeFalse
    }
});

export const setData = (dataName: string, data: any): Action => ({
    type: DataActionType.SET_DATA,
    payload: {
        dataName,
        data
    }
});