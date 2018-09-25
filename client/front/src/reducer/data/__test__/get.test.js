import reducer from '../get';
import { Data as types } from '../../../action/types';
import { FetchStatus } from '../../../constant';

const NO_ERROR = {
    code: 0,
    message: ''
};

const initial = {
    menus: {
        data: [],
        error: { ...NO_ERROR },
        fetchStatus: FetchStatus.INITIAL,
        fetchComplete: false
    },
    article: {
        data : {
            title: '',
            createdAt: '',
            content: '',
            summary: '',
        },
        error: { ...NO_ERROR },
        fetchStatus: FetchStatus.INITIAL,
        fetchComplete: false
    },
    articles: {
        data: [],
        error: { ...NO_ERROR },
        fetchStatus: FetchStatus.INITIAL,
        fetchComplete: false
    },
    hottestArticles: {
        data: [],
        error: { ...NO_ERROR },
        fetchStatus: FetchStatus.INITIAL,
        fetchComplete: false
    },
};

describe('app.data.get reducer test', () => {
    test('Should return the initial state', () => {
        const actual = reducer(undefined, {});
        const expected = { ...initial };
        expect(actual).toEqual(expected);
    });
    
    test('Should handle REQUEST_GET_DATA', () => {
        const actual = reducer(undefined, {
            type: types.REQUEST_GET_DATA,
            payload: {
                dataName: 'menus'
            }
        });
        const expected = {
            ...initial,
            menus: {
                data: [],
                fetchComplete: false,
                fetchStatus: FetchStatus.WAIT,
                error: { ...NO_ERROR }
            }
        };
        expect(actual).toEqual(expected);
    });

    test('Should handle REQUEST_GET_DATA_WITH_URL', () => {
        const dataName = 'articles';
        const actual = reducer(undefined, {
            type: types.REQUEST_GET_DATA_WITH_URL,
            payload: {
                dataName
            }
        });
        const expected = {
            ...initial,
            [dataName]: {
                data: [],
                fetchComplete: false,
                fetchStatus: FetchStatus.WAIT,
                error: { ...NO_ERROR }
            }
        };
        expect(actual).toEqual(expected);
    });

    test('Should handle GET_DATA_RESPONSE_SUCCESS', () => {
        const dataName = 'menus';
        const data = [
            { uid: '0x0000', title: 'test title 1', url: '/testurl1' },
            { uid: '0x0001', title: 'test title 2', url: '/testurl2'}
        ];
        const actual = reducer(undefined, {
            type: types.GET_DATA_RESPONSE_SUCCESS,
            payload: {
                dataName,
                data
            }
        });
        const expected = {
            ...initial,
            [dataName]: {
                data,
                fetchComplete: true,
                fetchStatus: FetchStatus.SUCCESS,
                error: { ...NO_ERROR }
            }
        };
        expect(actual).toEqual(expected);
    });

    test('Should handle GET_DATA_RESPONSE_ERROR', () => {
        const dataName = 'hottestArticles';
        const err = {
            code: 500,
            message: 'Test error message'
        };
        const actual = reducer(undefined, {
            type: types.GET_DATA_RESPONSE_ERROR,
            payload: {
                dataName,
                error: { ...err }
            }
        });
        const expected = { 
            ...initial,
            [dataName]: {
                ...initial[dataName],
                fetchComplete: true,
                fetchStatus: FetchStatus.FAIL,
                error: { ...err }
            }
        };
        expect(actual).toEqual(expected);
    });

    test('Should not handle other action type', () => {
        const actual = reducer(undefined, {
            type: types.REQUEST_GET_DATA_WITH_NAME_AND_URL,
            payload: {
                dataName: 'menus'
            }
        });
        const expected = { ...initial };
        expect(actual).toEqual(expected);
    });
});