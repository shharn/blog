import { Data as DataActionType } from '../../action/types';
import { FetchStatus, MutationOperationType } from '../../constant';

const initialState = {
    menus: {
        data: {},
        error: {
            code: 0,
            message: ""
        },
        fetchStatus: FetchStatus.FETCH_INITIAL,
        fetchComplete: false
    },
    articles: {
        data: {},
        error: {
            code: 0,
            message: ""
        },
        fetchStatus: FetchStatus.FETCH_INITIAL,
        fetchComplete: false
    }
};

const reducer = (state= initialState, action) => {
    const { type } = action;
    const { dataName } = action.payload || "";
    switch (type) {
        case DataActionType.REQUEST_GET_DATA: {
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: false,
                    fetchStatus: FetchStatus.FETCH_WAIT
                }
            };
        }
        case DataActionType.GET_DATA_RESPONSE_SUCCESS: {
            let { data } = action.payload;
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: true,
                    fetchStatus: FetchStatus.FETCH_SUCCESS,
                    data: data
                }
            };
        }
        case DataActionType.GET_DATA_RESPONSE_ERROR: {
            let { error } = action.payload;
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: true,
                    fetchStatus: FetchStatus.FETCH_FAIL,
                    error
                }
            };
        }
        case DataActionType.DATA_MUTATION_SUCCESS: {
            let { data, operationType } = action.payload;
            let changedData
            if (operationType === MutationOperationType.CREATE) {
                changedData = { ...state[dataName].data, [data.id]: data}
            } else if (operationType === MutationOperationType.DELETE) {
                changedData = { ...state[dataName].data }
                delete changedData[data.id]
            } else if (operationType === MutationOperationType.UPDATE) {
                changedData = { ...state[dataName].data, [data.id]: data }
            }
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    data: changedData
                }
            };
        }
        default:
            return state;
    }
};

export default reducer;