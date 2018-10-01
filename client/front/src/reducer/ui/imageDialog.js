// @flow
import { Data as DataActionType } from '../../action/types';
import { ImageUploadStatus } from '../../constant';
import type { Action } from '../../action/types';
import type { ClientError } from '../../flowtype';

export type ImageDialogState = {
    uploadStatus: $Values<ImageUploadStatus>,
    error: ClientError
};

const NO_ERROR = {
    code: 0,
    message: ''
};

const initialState: ImageDialogState = {
    uploadStatus: ImageUploadStatus.INITIAL,
    error: { ...NO_ERROR }
};

const reducer = (state: ImageDialogState = initialState, action: Action): ImageDialogState => {
    const { type } = action;
    switch(type) {
        case DataActionType.UPLOAD_IMAGE: 
            return {
                ...state,
                error: { ...NO_ERROR },
                uploadStatus: ImageUploadStatus.UPLOADING
            };
        case DataActionType.UPLOAD_IMAGE_SUCCESS:
            return {
                ...state,
                uploadStatus: ImageUploadStatus.SUCCESS
            };
        case DataActionType.UPLOAD_IMAGE_FAIL:
            return {
                ...state,
                uploadStatus: ImageUploadStatus.FAIL,
                error: action.payload.error
            };
        case DataActionType.INITIALIZE_IMAGE_DIALOG_STATUS:
            return {
                ...state,
                uploadStatus: ImageUploadStatus.INITIAL,
                error: { ...NO_ERROR }
            };
        default:
            return state;
    }
};

export default reducer;