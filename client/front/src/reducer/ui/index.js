import { combineReducers } from 'redux';
import menuList from './menuList';
import createOrEditMenu from './createOrEditMenu';
import createOrEditArticle from './createOrEditArticle';
import menuManager from './menuManager';
import imageDialog from './imageDialog';

const reducers = combineReducers({
    menuList,
    createOrEditMenu,
    createOrEditArticle,
    menuManager,
    imageDialog
});

export default reducers;