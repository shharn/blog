// @flow
import { Data as DataActionType } from '../../action/types';
import { FetchStatus } from '../../constant';
import type {
    Action
} from '../../action/types';
import type {
    ClientError
} from '../../flowtype';


type Mutation = {
    status: $Values<FetchStatus>,
    isFetching: boolean,
    error: ClientError
};

type MutationType = {
    [key: 'create' | 'update' | 'delete']: Mutation
};

export type MutationState = {
    [key: string]: MutationType
};

const INITIAL_STATES: Mutation = {
    status: FetchStatus.INITIAL,
    isFetching: false,
    error: null
};

const initialState: MutationState = {
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

const reducer = (state: MutationState = initialState, action: Action): MutationState => {
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
                        isFetching: true,
                        error: null
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
                        isFetching: false,
                        error: null
                    }
                }
            };
        case DataActionType.DATA_MUTATION_FAIL:
            const { error } = action.payload;
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
        case DataActionType.INITIALIZE_MUTATION_STATUS:
            return {
                ...state,
                [dataName]: {
                    ...state[dataName],
                        [operationType]: {
                            status: FetchStatus.INITIAL,
                            isFetching: false,
                            error: null
                        }
                    }
                };
        default:
            return state;
    }
};

export default reducer;