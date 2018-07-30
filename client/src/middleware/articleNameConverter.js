import { Data as DataActionType } from '../action/types';
import { PLACEHOLDER_NAME_TO_CONVERT } from '../constant';

const NAME_SEPERATOR = '-';
const WHITE_SPACE = ' ';

export const articleNameToUIDConverter = (action, srcData) => {
    // 'name' is always lowercase
    const { name,  dataName, propName } = action.payload;
    let { url } = action.payload;
    const data = articleDataProvider(srcData);
    let splitted = name.toLowerCase().split(NAME_SEPERATOR); // some_menu_example => ['some', 'name', example']
    let result = data.filter(datum => {
        // ex) Some Menu Example => some menu example => ['some', 'menu', 'example']
        let splitted2 = datum[propName].toLowerCase().split(WHITE_SPACE);
        if (splitted.length !== splitted2.length) return false;
        for (let i = 0; i < splitted.length; i++) {
            if (splitted[i] !== splitted2[i]) return false;
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

function articleDataProvider(state) {
    return state.app.data.get.articles.data;
}

export const articleConverterChecker = action => action.type === DataActionType.REQUEST_GET_DATA_WITH_NAME_AND_URL;