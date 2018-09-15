// @flow
import { combineReducers } from 'redux';
import get from './get';
import type { GetState } from './get';
import mutation from './mutation';
import type { MutationState } from './mutation';

export type DataState = {
    get: GetState,
    mutation: MutationState
};

const reducer = combineReducers({ 
    get, 
    mutation 
});

export default reducer;