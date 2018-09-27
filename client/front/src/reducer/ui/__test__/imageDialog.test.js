import reducer from '../imageDialog';
import { Data as DataActionType } from '../../../action/types';
import { ImageUploadStatus } from '../../../constant';

const initialState = {
    uploadStatus: ImageUploadStatus.INITIAL
};

describe('app.ui.imageDialog reducer test', () => {
    test('Should return the initial state', () => {
        const actual = reducer(undefined, {});
        const expected = { ...initialState };
        expect(actual).toEqual(expected);
    });

    test('Should handle UPLOAD_IMAGE', () => {
        const actual = reducer(undefined, {
            type: DataActionType.UPLOAD_IMAGE
        });
        const expected = {
            ...initialState,
            uploadStatus: ImageUploadStatus.UPLOADING
        };
        expect(actual).toEqual(expected);
    });

    test('Should handle UPLOAD_IMAGE_SUCCESS', () => {
        const initial = {
            ...initialState,
            uploadStatus: ImageUploadStatus.UPLOADING
        };
        const actual = reducer(initial, {
            type: DataActionType.UPLOAD_IMAGE_SUCCESS
        });
        const expected = {
            ...initialState,
            uploadStatus: ImageUploadStatus.SUCCESS
        };
        expect(actual).toEqual(expected);
    });

    test('Should handle UPLOAD_IMAGE_FAIL', () => {
        const initial = {
            ...initialState,
            uploadStatus: ImageUploadStatus.UPLOADING
        };
        const actual = reducer(initial, {
            type: DataActionType.UPLOAD_IMAGE_FAIL
        });
        const expected = {
            ...initialState,
            uploadStatus: ImageUploadStatus.FAIL
        };
        expect(actual).toEqual(expected);
    });

    test('Should handle INITIALIZE_IMAGE_DIALOG_STATUS', () => {
        const initial = {
            ...initialState,
            uploadStatus: ImageUploadStatus.FAIL
        };
        const actual = reducer(initial, {
            type: DataActionType.INITIALIZE_IMAGE_DIALOG_STATUS
        });
        const expected = {
            ...initialState,
            uploadStatus: ImageUploadStatus.INITIAL
        };
        expect(actual).toEqual(expected);
    });
});