// @flow
import { combineReducers } from 'redux';
import menuList from './menuList';
import type { MenuListState } from './menuList';
import createOrEditMenu from './createOrEditMenu';
import type { CreateOrEditMenuState } from './createOrEditMenu';
import createOrEditArticle from './createOrEditArticle';
import type { CreateOrEditArticleState } from './createOrEditArticle';
import menuManager from './menuManager';
import type { MenuManagerState } from './menuManager';
import imageDialog from './imageDialog';
import type { ImageDialogState } from './imageDialog';

export type UIState = {
    menuList: MenuListState,
    createOrEditArticle: CreateOrEditArticleState,
    createOrEditMenu: CreateOrEditMenuState,
    menuManager: MenuManagerState,
    imageDialog: ImageDialogState
};

const reducers = combineReducers({
    menuList,
    createOrEditMenu,
    createOrEditArticle,
    menuManager,
    imageDialog
});

export default reducers;