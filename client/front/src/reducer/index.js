// @flow
import { combineReducers } from 'redux';
import auth from './auth';
import type { AuthState } from './auth';
import data from './data';
import type { DataState } from './data';
import ui from './ui'
import type { UIState } from './ui';

const rootReducer = combineReducers({ 
    auth, 
    data, 
    ui
 });

export type AppState = {
    auth: AuthState,
    data: DataState,
    ui: UIState
};

export default rootReducer;