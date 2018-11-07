// @flow
import { Data as DataActionType } from '../action/types';
import { PLACEHOLDER_NAME_TO_CONVERT } from '../constant';
import { createActionConverter } from './actionConverter';

const NAME_SEPERATOR = '-';
const WHITE_SPACE = ' ';

const menuDataFilter = (state: AppState): Object => state.app.data.get.menus.data;

const menuNameConverterChecker = (action: Action): boolean => 
    action.type === DataActionType.REQUEST_GET_DATA_WITH_NAME_AND_URL && 
    action.payload.propName === 'name';

const articleDataFilter = (state: AppState): Object => {
    let data = state.app.data.get.articles.data;
    if (!!!data.length) {
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
    
const dataNameToUIDConverter = (action, srcData, targetDataFilter) => {
    // 'name' is always lowercase
    const { name,  dataName, propName } = action.payload;
    let { url } = action.payload;
    const data = targetDataFilter(srcData);
    let splitted = name.toLowerCase().split(NAME_SEPERATOR); // some_menu_example => ['some', 'name', example']
    let result = data.filter(datum => {
        // ex) Some Menu Example => some menu example => ['some', 'menu', 'example']
        let splitted2 = datum[propName].toLowerCase().split(WHITE_SPACE);
        if (splitted.length !== splitted2.length) return false;
        for (let i = 0; i < splitted.length; i++) {
            if (splitted[i] !== splitted2[i]) {
                return false;
            }
        }
        return true;
    });
    let uid = result && result.length > 0 ? result[0].uid : null
    url = action.payload.url.replace(PLACEHOLDER_NAME_TO_CONVERT, uid);

    
    return {
        type: DataActionType.REQUEST_GET_DATA_WITH_URL,
        payload: {
            dataName,
            url,
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


