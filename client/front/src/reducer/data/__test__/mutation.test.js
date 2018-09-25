import reducer from '../mutation';
import { Data as DataActionType } from '../../../action/types';
import { FetchStatus } from '../../../constant';

const INITIAL_STATES = {
    status: FetchStatus.INITIAL,
    isFetching: false,
    error: null
};

const initialState = {
    menus: {
        create: { ...INITIAL_STATES },
        update: { ...INITIAL_STATES },
        delete: { ...INITIAL_STATES }
    },
    articles: {
        create: { ...INITIAL_STATES },
        update: { ...INITIAL_STATES },
        delete: { ...INITIAL_STATES }
    }
};

describe('app.data.mutation reducer test', () => {
    it('Should return the initial state', () => {
        const actual = reducer(undefined, {});
        const expected = { ...initialState };
        expect(actual).toEqual(expected);
    });

    test('Should handle REQUEST_MUTATE_DATA', () => {
        const dataName = 'menus';
        const operationType = 'create';
        const actual = reducer(undefined, {
            type: DataActionType.REQUEST_MUTATE_DATA,
            payload: {
                dataName,
                operationType
            }
        });
        const expected = {
            ...initialState,
            [dataName]: {
                ...initialState[dataName],
                [operationType]: {
                    status: FetchStatus.WAIT,
                    isFetching: true,
                    error: null
                }
            }
        };
        expect(actual).toEqual(expected);
    });

    test('Should handle DATA_MUTATION_SUCCESS', () => {
        const dataName = 'articles';
        const operationType = 'update';
        const actual = reducer(undefined, {
            type: DataActionType.DATA_MUTATION_SUCCESS,
            payload: {
                dataName,
                operationType
            }
        });
        const expected = {
            ...initialState,
            [dataName]: {
                ...initialState[dataName],
                [operationType]: {
                    status: FetchStatus.SUCCESS,
                    isFetching: false,
                    error: null
                }
            }
        };
        expect(actual).toEqual(expected);
    });

    test('Should handle DATA_MUTATION_FAIL', () => {
        const dataName = 'menus';
        const operationType = 'delete';
        const error = {
            code: 400,
            message: 'test error message'
        }
        const actual = reducer(undefined, {
            type: DataActionType.DATA_MUTATION_FAIL,
            payload: {
                dataName,
                operationType,
                error
            }
        });
        const expected = {
            ...initialState,
            [dataName]: {
                ...initialState[dataName],
                [operationType]: {
                    status: FetchStatus.FAIL,
                    isFetching: false,
                    error
                }
            }
        };
        expect(actual).toEqual(expected);
    });

    describe('Should handle INITIALIZE_MUTATION_STATUS', () => {
        test('Should have initial state when FetchStatus.INITIAL', () => {
            const dataName = 'articles';
            const operationType = 'create';
            const actual = reducer(undefined, {
                type: DataActionType.INITIALIZE_MUTATION_STATUS,
                payload: {
                    dataName,
                    operationType
                }
            });
            const expected = {
                ...initialState,
                [dataName]: {
                    ...initialState[dataName],
                    [operationType]: {
                        status: FetchStatus.INITIAL,
                        isFetching: false,
                        error: null
                    }
                }
            };
            expect(actual).toEqual(expected);
        });

        test('Should have initial state when FetchStatus.WAIT', () => {
            const dataName = 'articles';
            const operationType = 'update';
            const initial = {
                ...initialState,
                [dataName]: {
                    ...initialState[dataName],
                    [operationType]: {
                        status: FetchStatus.WAIT,
                        isFetching: true,
                        error: null
                    }
                }
            };
            const actual = reducer(initial, {
                type: DataActionType.INITIALIZE_MUTATION_STATUS,
                payload: {
                    dataName,
                    operationType
                }
            });
            const expected = {
                ...initialState,
                [dataName]: {
                    ...initialState[dataName],
                    [operationType]: {
                        status: FetchStatus.INITIAL,
                        isFetching: false,
                        error: null
                    }
                }
            };
            expect(actual).toEqual(expected);
        });

        test('Should have initial state when FetchStatus.FAIL', () => {
            const dataName = 'menus';
            const operationType = 'delete';
            const initial = {
                ...initialState,
                [dataName]: {
                    ...initialState[dataName],
                    [operationType]: {
                        status: FetchStatus.FAIL,
                        isFetching: false,
                        error: {
                            code: 500,
                            message: 'test error message'
                        }
                    }
                }
            };
            const actual = reducer(initial, {
                type: DataActionType.INITIALIZE_MUTATION_STATUS,
                payload: {
                    dataName,
                    operationType
                }
            });
            const expected = {
                ...initialState,
                [dataName]: {
                    ...initialState[dataName],
                    [operationType]: {
                        status: FetchStatus.INITIAL,
                        isFetching: false,
                        error: null
                    }
                }
            };
            expect(actual).toEqual(expected);
        });
    });
});