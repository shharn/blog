import { data as dataActionType } from '../../action/types';
import { fetchStatus } from '../../constant';

const initialState = {
    menus: {
        status: fetchStatus.FETCH_INITIAL,
        isFetching: false
    },
    articles: {
        status:fetchStatus.FETCH_INITIAL,
        isFetching: false
    }
}

const reducer = (state = initialState, action) => {
    const { type, dataName, operationName } = action
    switch(type) {
        case dataActionType.REQUEST_MUTATE_DATA:
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    [operationName]: {
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
                    [operationName]: {
                        status: fetchStatus.FETCH_SUCCESS,
                        isFetching: false
                    }
                }
            }
        case dataActionType.DATA_MUTATION_FAIL:
            const { error } = this.action;
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                        [operationName]: {
                        status: fetchStatus.FETCH_FAIL,
                        isFetching: false,
                        error
                    }
                }
            }
        default:
            return state;
    }
}

export default reducer;