import { Data as DataActionType } from '../../action/types';
import { FetchStatus } from '../../constant';

const initialState = {
    menus: {
        data: [],
        error: {
            code: 0,
            message: ""
        },
        fetchStatus: FetchStatus.FETCH_INITIAL,
        fetchComplete: false
    },
    articles: {
        data: [],
        error: {
            code: 0,
            message: ""
        },
        fetchStatus: FetchStatus.FETCH_INITIAL,
        fetchComplete: false
    },
    hottestArticles: {
        data: [],
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
        case DataActionType.REQUEST_GET_DATA:
        case DataActionType.REQUEST_GET_DATA_WITH_URL: {
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: false,
                    fetchStatus: FetchStatus.WAIT
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
                    fetchStatus: FetchStatus.SUCCESS,
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
                    fetchStatus: FetchStatus.FAIL,
                    error
                }
            };
        }
        default:
            return state;
    }
};

export default reducer;