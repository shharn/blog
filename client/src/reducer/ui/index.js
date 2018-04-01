import { combineReducers } from 'redux';
import menuList from './menuList';
import createOrEditMenu from './createOrEditMenu';
import menuManager from './menuManager';

const reducers = combineReducers({
    menuList,
    createOrEditMenu,
    menuManager
});

export default reducers;