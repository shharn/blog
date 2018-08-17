import { combineReducers } from 'redux';
import auth from './auth';
import data from './data';
import ui from './ui';

const rootReducer = combineReducers({ auth, data, ui });

export default rootReducer;