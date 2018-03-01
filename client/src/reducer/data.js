import { data as actionType } from '../action/types';
import { fetchStatus } from '../constant';

const initialState = {
    menus: {
        data: [],
        error: {
            code: 0,
            message: ""
        },
        fetchStatus: fetchStatus.FETCH_INITIAL,
        fetchComplete: false
    },
    articles: {
        data: [],
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
        case actionType.REQUEST_DATA: 
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: false,
                    fetchStatus: fetchStatus.FETCH_WAIT
                }
            };
        case actionType.RESPONSE_SUCCESS: 
            let { data } = action.payload;
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: true,
                    fetchStatus: fetchStatus.FETCH_SUCCESS,
                    data
                }
            };
        case actionType.RESPONSE_ERROR:
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
        default:
            return state;
    }
}

export default reducer;