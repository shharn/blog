import { Data as DataActionType } from '../../action/types';
import { FetchStatus } from '../../constant';

const initialState = {
    menus: {
        create: {
            status: FetchStatus.FETCH_INITIAL,
            isFetching: false
        },
        update: {
            state: FetchStatus.FETCH_INITIAL,
            isFetching: false
        },
         delete: {
            state: FetchStatus.FETCH_INITIAL,
            isFetching: false
         }
    },
    articles: {
        create: {
            status: FetchStatus.FETCH_INITIAL,
            isFetching: false
        },
        update: {
            state: FetchStatus.FETCH_INITIAL,
            isFetching: false
        },
         delete: {
            state: FetchStatus.FETCH_INITIAL,
            isFetching: false
         }
    }
};

const reducer = (state = initialState, action) => {
    const { type } = action;
    const { dataName, operationType } = action.payload || {};
    switch(type) {
        case DataActionType.REQUEST_MUTATE_DATA:
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    [operationType]: {
                        status: FetchStatus.FETCH_WAIT,
                        isFetching: true
                    }
                }
            };
        case DataActionType.DATA_MUTATION_SUCCESS:
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    [operationType]: {
                        status: FetchStatus.FETCH_SUCCESS,
                        isFetching: false
                    }
                }
            };
        case DataActionType.DATA_MUTATION_FAIL:
            const { error } = this.action;
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                        [operationType]: {
                            status: FetchStatus.FETCH_FAIL,
                            isFetching: false,
                            error
                        }
                    }
                };
        case DataActionType.CHANGE_MUTATION_STATUS:
            const { statusToChange } = action.payload;
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                        [operationType]: {
                            status: statusToChange,
                            isFetching: false
                        }
                    }
                };
        default:
            return state;
    }
};

export default reducer;