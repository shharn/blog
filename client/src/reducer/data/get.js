import { data as dataActionType } from '../../action/types';
import { fetchStatus, mutationOperationType } from '../../constant';

const initialState = {
    menus: {
        data: {},
        error: {
            code: 0,
            message: ""
        },
        fetchStatus: fetchStatus.FETCH_INITIAL,
        fetchComplete: false
    },
    articles: {
        data: {},
        error: {
            code: 0,
            message: ""
        },
        fetchStatus: fetchStatus.FETCH_INITIAL,
        fetchComplete: false
    }
}

const reducer = (state= initialState, action) => {
    const { type } = action;
    const { dataName } = action.payload || "";
    switch (type) {
        case dataActionType.REQUEST_GET_DATA: {
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: false,
                    fetchStatus: fetchStatus.FETCH_WAIT
                }
            };
        }
        case dataActionType.GET_DATA_RESPONSE_SUCCESS: {
            let { data } = action.payload;
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: true,
                    fetchStatus: fetchStatus.FETCH_SUCCESS,
                    data: data[dataName]
                }
            };
        }
        case dataActionType.GET_DATA_RESPONSE_ERROR: {
            let { error } = action.payload;
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: true,
                    fetchStatus: fetchStatus.FETCH_FAIL,
                    error
                }
            };
        }
        case dataActionType.DATA_MUTATION_SUCCESS: {
            let { data, operationType } = action.payload;
            console.dir(data)
            let changedData
            if (operationType === mutationOperationType.CREATE) {
                changedData = { ...state[dataName].data, [data.id]: data}
            } else if (operationType === mutationOperationType.DELETE) {
                changedData = { ...state[dataName].data }
                delete changedData[data.id]
            } else if (operationType === mutationOperationType.UPDATE) {
                changedData = { ...state[dataName].data, [data.id]: data }
            }
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    data: changedData
                }
            }
        }
        default:
            return state;
    }
}

export default reducer;