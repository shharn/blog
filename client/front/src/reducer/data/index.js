import { combineReducers } from 'redux';
import get from './get';
import mutation from './mutation';

const reducer = combineReducers({ get, mutation });

export default reducer;