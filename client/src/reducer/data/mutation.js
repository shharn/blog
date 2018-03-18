import { data as dataActionType } from '../../action/types';
import { fetchStatus } from '../../constant';

const initialState = {
    menus: {
        create: {
            status: fetchStatus.FETCH_INITIAL,
            isFetching: false
        },
        update: {
            state: fetchStatus.FETCH_INITIAL,
            isFetching: false
        },
         delete: {
            state: fetchStatus.FETCH_INITIAL,
            isFetching: false
         }
    },
    articles: {
        create: {
            status: fetchStatus.FETCH_INITIAL,
            isFetching: false
        },
        update: {
            state: fetchStatus.FETCH_INITIAL,
            isFetching: false
        },
         delete: {
            state: fetchStatus.FETCH_INITIAL,
            isFetching: false
         }
    }
}

const reducer = (state = initialState, action) => {
    const { type } = action
    const { dataName, operationType } = action.payload || {}
    switch(type) {
        case dataActionType.REQUEST_MUTATE_DATA:
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    [operationType]: {
                        status: fetchStatus.FETCH_WAIT,
                        isFetching: true
                    }
                }
            }
        case dataActionType.DATA_MUTATION_SUCCESS:
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    [operationType]: {
                        status: fetchStatus.FETCH_SUCCESS,
                        isFetching: false
                    }
                }
            }
        case dataActionType.DATA_MUTATION_FAIL:
            const { error } = this.action
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                        [operationType]: {
                            status: fetchStatus.FETCH_FAIL,
                            isFetching: false,
                            error
                        }
                    }
                }
        case dataActionType.CHANGE_MUTATION_STATUS:
            const { statusToChange } = action.payload
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                        [operationType]: {
                            status: statusToChange,
                            isFetching: false
                        }
                    }
                }
        default:
            return state;
    }
}

export default reducer;