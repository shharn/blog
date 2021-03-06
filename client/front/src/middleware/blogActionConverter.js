// @flow
import { Data as DataActionType } from '../action/types';
import { PLACEHOLDER_NAME_TO_CONVERT } from '../constant';
import { createActionConverter } from './actionConverter';
import type { Action } from '../action/types';
import type { State } from '../flowtype';

const menuDataFilter = (state: State): Object => state.app.data.get.menus.data;

const menuNameConverterChecker = (action: Action): boolean => 
    action.type === DataActionType.REQUEST_GET_DATA_WITH_NAME_AND_URL && 
    action.payload.propName === 'name';

const articleDataFilter = (state: State): Object => {
    let data = state.app.data.get.articles.data;
    if (!data.length) {
        data = state.app.data.get.hottestArticles.data;
    }
    return data;
}

const articleNameConverterChecker = (action: Action): boolean => 
    action.type === DataActionType.REQUEST_GET_DATA_WITH_NAME_AND_URL && 
    action.payload.propName === 'title';

const createDataNameToUIDConverter = (targetDataFilter) => {
    return (action, srcData) => {
        return dataNameToUIDConverter(action , srcData, targetDataFilter);
    }
}
    
const dataNameToUIDConverter = (action: Action, srcData: Object, targetDataFilter) => {
    const { name,  dataName, propName } = action.payload;
    let { url } = action.payload;
    const data = targetDataFilter(srcData);
    let decodedName = decodeURIComponent(name);
    let result = data.filter(datum => datum[propName] === decodedName);
    let uid = result && result.length > 0 ? result[0].uid : null
    const convertedURL = url.replace(PLACEHOLDER_NAME_TO_CONVERT, uid);
    return {
        type: DataActionType.REQUEST_GET_DATA_WITH_URL,
        payload: {
            dataName,
            url: convertedURL,
        }
    };
};

export const menuNameActionConverter = () => {
    return createActionConverter({
        checker: menuNameConverterChecker,
        converter: createDataNameToUIDConverter(menuDataFilter)
    });
};

export const articleNameActionConverter = () => {
    return createActionConverter({
        checker: articleNameConverterChecker,
        converter: createDataNameToUIDConverter(articleDataFilter)
    });
};