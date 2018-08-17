import { combineReducers } from 'redux';
import menuList from './menuList';
import createOrEditMenu from './createOrEditMenu';
import createOrEditArticle from './createOrEditArticle';
import menuManager from './menuManager';

const reducers = combineReducers({
    menuList,
    createOrEditMenu,
    createOrEditArticle,
    menuManager
});

export default reducers;