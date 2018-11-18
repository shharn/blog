// @flow
import { Data as DataActionType } from '../../action/types';
import { FetchStatus } from '../../constant';
import type { ClientError } from '../../flowtype';
import type { Action } from '../../action/types';

type DataTemplate = {
    data: Array<Object> | Object,
    error: ClientError,
    fetchStatus: $Values<FetchStatus>,
    fetchComplete: boolean,
    isServerRendered? : boolean
};

export type GetState = {
    [key: string]: DataTemplate
};

const EmptyData = {
    menus: [],
    article: {
        title: '',
        createdAt: '',
        content: '',
        summary: ''
    },
    articles: [],
    hottestArticles: []
};

const NO_ERROR: ClientError = {
    code: 0,
    message: ''
};

const initialState: GetState = {
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
        fetchComplete: false,
        isServerRendered: false
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

const reducer = (state: GetState = initialState, action: Action): GetState => {
    const { type } = action;
    const dataName = (action.payload && action.payload.dataName) || "";
    switch (type) {
        case DataActionType.REQUEST_GET_DATA:
        case DataActionType.REQUEST_GET_DATA_WITH_URL: {
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                    fetchComplete: false,
                    fetchStatus: FetchStatus.WAIT,
                    error: { ...NO_ERROR }
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
                    data,
                    error: { ...NO_ERROR }
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
        case DataActionType.INITIALIZE_DATA:
            return {
                ...state,
                [dataName]: {
                    data : EmptyData[dataName],
                    error: { ...NO_ERROR },
                    fetchStatus: FetchStatus.INITIAL,
                    fetchComplete: false
                }
            }
        case DataActionType.INITIALIZE_SERVER_RENDERING_FLAG:
            const maybeFalse = action.payload.maybeFalse;
            return {
                ...state,
                article: {
                    ...state.article,
                    isServerRendered: maybeFalse
                }
            };
        default:
            return state;
    }
};

export default reducer;