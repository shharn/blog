import { Data as DataActionType } from '../../action/types';
import { FetchStatus } from '../../constant';

const initialState = {
    menus: {
        create: {
            status: FetchStatus.INITIAL,
            isFetching: false
        },
        update: {
            status: FetchStatus.INITIAL,
            isFetching: false
        },
         delete: {
            status: FetchStatus.INITIAL,
            isFetching: false
         }
    },
    articles: {
        create: {
            status: FetchStatus.INITIAL,
            isFetching: false
        },
        update: {
            status: FetchStatus.INITIAL,
            isFetching: false
        },
         delete: {
            status: FetchStatus.INITIAL,
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
                        status: FetchStatus.WAIT,
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
                        status: FetchStatus.SUCCESS,
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
                            status: FetchStatus.FAIL,
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