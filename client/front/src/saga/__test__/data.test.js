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
import ls from 'local-storage';
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
jest.mock('../../service');

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
    describe('Should handle Each operation type with happy path', () => {
        const mockDataName = 'test';
        const mockData = {
            uid: '0x001',
            name: 'name to be updated/created'
        };
        const mockToken = 'testtoken';
        const operationTypes = [ 
            { type: MutationOperationType.CREATE, method: createData },
            { type: MutationOperationType.UPDATE, method: updateData },
            { type: MutationOperationType.DELETE, method: deleteData }
        ];
        const mockResponse = {
            status: 200
        };
        const actionType = DataActionType.REQUEST_MUTATE_DATA;

        beforeEach(() => {
            ls.set(Token.key, mockToken);
        });

        operationTypes.forEach(operationType => {
            test(`Happy path test for ${operationType.type}`, () =>{
                const mockOperationType = operationType.type;
                const gen = dataMutationRequestHandler({
                    type: actionType,
                    payload: {
                        dataName: mockDataName,
                        operationType: mockOperationType,
                        data: { ...mockData }
                    }
                });
                let next = gen.next(operationType.method(mockDataName, mockData, mockToken));
                expect(next.value).toEqual(call(operationType.method, mockDataName, mockData, mockToken));

                next = gen.next({ ...mockResponse });
                expect(next.value).toEqual(put(dataMutationSuccess(mockDataName, mockOperationType, undefined)));

                next = gen.next();
                expect(next).toEqual({ done: true });
            });
        });
    });

    describe('unhappy path', () => {
        const mockDataName = 'test';
        const mockOperationType = MutationOperationType.UPDATE;
        const mockData = {
            uid: '0x001',
            name: 'name to be updated'
        };
        const mockToken = 'testtoken';
        const gen = cloneableGenerator(dataMutationRequestHandler)({
            type: DataActionType.REQUEST_MUTATE_DATA,
            payload: {
                dataName: mockDataName,
                operationType: mockOperationType,
                data: { ...mockData }
            }
        });

        beforeEach(() => {
            ls.set(Token.key, mockToken);
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
            ls.remove(Token.key);
            const clone = gen.clone();
            let next = clone.next();
            expect(next.value).toEqual(put(dataMutationFail(mockDataName, mockOperationType, {
                code: 401,
                message : 'Invalid token'
            })));

            next = clone.next();
            expect(next).toEqual({ done: true });
        });

        test('Invalid token', () => {
            const mockResponse = {
                status: 401,
                body: {
                    message: 'test error message'
                }
            };
            const clone = gen.clone();
            let next = clone.next(updateData(mockDataName, mockData, mockToken));
            expect(next.value).toEqual(call(updateData, mockDataName, mockData, mockToken));

            next = clone.next({ ...mockResponse });
            expect(next.value).toEqual(put(dataMutationFail(mockDataName, mockOperationType, {
                code: mockResponse.status,
                message: mockResponse.body.message
            })));

            next = clone.next();
            expect(next).toEqual({ done: true });
        });
    });
});

describe('Should handle UPLOAD_IMAGE', () => {
    const mockToken = 'testtoken';
    const mockFiles = [ {}, {} ];
    const gen = cloneableGenerator(uploadImageRequestHandler)({
        type: DataActionType.UPLOAD_IMAGE,
        payload: {
            files: [ ...mockFiles ]
        }
    });

    beforeEach(() => {
        ls.set(Token.key, mockToken);
    });

    test('Network is offline', () => {
        const clone = gen.clone();
        let next = clone.next(uploadImage([ ...mockFiles ], mockToken));
        expect(next.value).toEqual(call(uploadImage, [ ...mockFiles ], mockToken));

        next  = clone.next(NETWORK_OFFLINE_RESPONSE);
        expect(next.value).toEqual(put(uploadImageFail({
            code: -1,
            message: 'Network is Offline :('
        })));

        next = clone.next();
        expect(next).toEqual({ done: true });
    });

    test('Has no token', () => {
        ls.remove(Token.key);
        const clone = gen.clone();
        let next = clone.next();
        expect(next.value).toEqual(put(uploadImageFail({
            code: 401,
            message: 'Invalid Token'
        })));

        next = clone.next();
        expect(next).toEqual({ done: true });
    });

    test('Invalid token', () => {
        const mockMessage = 'test error message';
        const mockResponse = {
            status: 401,
            body: {
                message: mockMessage
            }
        };
        const clone = gen.clone();
        let next = clone.next(uploadImage([ ...mockFiles ], mockToken));
        expect(next.value).toEqual(call(uploadImage, [ ...mockFiles ], mockToken));

        next = clone.next({ ...mockResponse });
        expect(next.value).toEqual(put(uploadImageFail({
            code: 401,
            message: mockMessage
        })));

        next = clone.next();
        expect(next).toEqual({ done: true });
    });

    test('Happy path', () => {
        const mockResponse = {
            status: 200
        };
        const clone = gen.clone();
        let next = clone.next(uploadImage([ ...mockFiles ], mockToken));
        expect(next.value).toEqual(call(uploadImage, [ ...mockFiles ], mockToken ));

        next = clone.next({ ...mockResponse });
        expect(next.value).toEqual(put(uploadImageSuccess()));

        next = clone.next();
        expect(next).toEqual({ done: true });
    });
});