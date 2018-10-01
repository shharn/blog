import {
    dataGetRequestHandler,
    dataGetRequestWithURLHandler,
    dataMutationRequestHandler,
    uploadImageRequestHandler
} from '../data';
import { 
    dataResponseSuccess, 
    dataResponseFailed,
    dataMutationSuccess,
    dataMutationFail,
    uploadImageSuccess,
    uploadImageFail
} from '../../action/data';
import  {
    put,
    call
} from 'redux-saga/effects';
import { Data as DataActionType } from '../../action/types';
import { cloneableGenerator } from 'redux-saga/utils';
import { 
    MutationOperationType, 
    Token
} from '../../constant';
import { 
    getData,
    getDataWithURL,
    createData,
    deleteData,
    updateData,
    uploadImage
} from '../../service';

const NETWORK_ERROR = {
    code: -1,
    message: 'Network is Offline :('
};

const NETWORK_OFFLINE_RESPONSE = { };

describe('Should handle REQUEST_GET_DATA', () => {
    const mockDataName = 'test';
    const gen = cloneableGenerator(dataGetRequestHandler)({
        type: DataActionType.REQUEST_GET_DATA,
        payload: {
            dataName: mockDataName
        }
    });

    test('Network is offline', () => {
        const clone = gen.clone();
        let next = clone.next(getData(mockDataName));
        expect(next.value).toEqual(call(getData, mockDataName));

        next = clone.next({ ...NETWORK_OFFLINE_RESPONSE });
        expect(next.value).toEqual(put(dataResponseFailed({ ...NETWORK_ERROR }, mockDataName)));

        next = clone.next();
        expect(next.done).toBe(true);
    });

    test('Network is online', () => {
        const mockResponse = {
            status: 200,
            body: {
                data: [
                    { uid: '0x001', name: 'test name 1' },
                    { uid: '0x002', name: 'test name 2' },
                    { uid: '0x003', name: 'test name 3' }
                ]
            }
        };
        const clone = gen.clone();
        let next = clone.next(getData(mockDataName));
        expect(next.value).toEqual(call(getData, mockDataName));

        next = clone.next({ ...mockResponse });
        expect(next.value).toEqual(put(dataResponseSuccess(mockResponse.body, mockDataName)));

        next = clone.next();
        expect(next).toEqual({ done: true });
    });
});

describe('Should handle REQUEST_GET_DATA_WITH_URL', () => {
    const mockDataName = 'test';
    const mockURL = 'testurl';
    const gen = cloneableGenerator(dataGetRequestWithURLHandler)({
        type: DataActionType.REQUEST_GET_DATA_WITH_URL,
        payload: {
            dataName: mockDataName,
            url: mockURL
        }
    });

    test('Network is offline', () => {
        const clone = gen.clone();
        let next = clone.next(getDataWithURL(mockURL));
        expect(next.value).toEqual(call(getDataWithURL, mockURL));

        next = clone.next({ ...NETWORK_OFFLINE_RESPONSE });
        expect(next.value).toEqual(put(dataResponseFailed({ ...NETWORK_ERROR }, mockDataName)));

        next = clone.next();
        expect(next.done).toBe(true);
    });

    test('Network is online, Action has a URL value with leading slash', () => {
        const mockURLWIthLeadingSlash = '/testurl';
        const mockResponse = {
            status: 200,
            body: {
                data: [
                    { uid: '0x001', name: 'test name 1' },
                    { uid: '0x002', name: 'test name 2' },
                    { uid: '0x003', name: 'test name 3' }
                ]
            }
        };
        const clone = gen.clone();
        let next = clone.next(getDataWithURL(mockURLWIthLeadingSlash));
        expect(next.value).toEqual(call(getDataWithURL, mockURL));

        next = clone.next({ ...mockResponse });
        expect(next.value).toEqual(put(dataResponseSuccess(mockResponse.body, mockDataName)));

        next = clone.next();
        expect(next).toEqual({ done: true });
    });

    test('Network is online, Action has a URL value without leading slash', () => {
        const mockResponse = {
            status: 200,
            body: {
                data: [
                    { uid: '0x001', name: 'test name 1' },
                    { uid: '0x002', name: 'test name 2' },
                    { uid: '0x003', name: 'test name 3' }
                ]
            }
        };
        const clone = gen.clone();
        let next = clone.next(getDataWithURL(mockURL));
        expect(next.value).toEqual(call(getDataWithURL, mockURL));

        next = clone.next({ ...mockResponse });
        expect(next.value).toEqual(put(dataResponseSuccess(mockResponse.body, mockDataName)));

        next = clone.next();
        expect(next).toEqual({ done: true });
    });
});

describe('Should handle REQUEST_MUTATE_DATA', () => {
    const mockDataName = 'test';
    const mockOperationType = MutationOperationType.UPDATE;
    const mockData = {
        uid: '0x001',
        name: 'name to be updated'
    };
    const mockToken = 'testtoken';
    const gen = cloneableGenerator(dataGetRequestWithURLHandler)({
        type: DataActionType.REQUEST_MUTATE_DATA,
        payload: {
            dataName: mockDataName,
            operationType: mockOperationType,
            data: { ...mockData }
        }
    });

    test('Network is offline', () => {
        const clone = gen.clone();
        let next = clone.next(updateData(mockDataName, mockData, mockToken));
        expect(next.value).toEqual(call(updateData, mockDataName, mockData, mockToken));

        next = clone.next({ ...NETWORK_OFFLINE_RESPONSE });
        expect(next.value).toEqual(put(dataMutationFail(mockDataName, mockOperationType, { ...NETWORK_ERROR })));

        next = clone.next();
        expect(next.done).toBe(true);
    });

    test('Has no token', () => {

    });

    test('Has valid token, normal request', () => {

    });
});

describe('Should handle UPLOAD_IMAGE', () => {
    test('asdf', () => {
    
    });
});