// @flow
import { Data as DataActionType } from '../../action/types';
import { ImageUploadStatus } from '../../constant';

import type {
    Action
} from '../../action/types';

export type ImageDialogState = {
    uploadStatus: $Values<ImageUploadStatus>,
};

const initialState: ImageDialogState = {
    uploadStatus: ImageUploadStatus.INITIAL
};

const reducer = (state: ImageDialogState = initialState, action: Action): ImageDialogState => {
    const { type } = action;
    switch(type) {
        case DataActionType.UPLOAD_IMAGE: 
            return {
                ...state,
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
                uploadStatus: ImageUploadStatus.FAIL
            };
        case DataActionType.INITIALIZE_IMAGE_DIALOG_STATUS:
            return {
                ...state,
                uploadStatus: ImageUploadStatus.INITIAL,
            };
        default:
            return state;
    }
};

export default reducer;