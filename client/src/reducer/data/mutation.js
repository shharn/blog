import { data as dataActionType } from '../../action/types';

const initialState = {
    menus: {

    },
    articles: {
        
    }
}

const reducer = (state = initialState, action) => {
    const { type } = action;
    switch(type) {
        case dataActionType.REQUEST_CREATE_DATA:
            break;
        case dataActionType.REQUEST_DELETE_DATA:
            break;
        case dataActionType.REQUEST_UPDATE_DATA:
            break;
        case dataActionType.DATA_MUTATION_SUCCESS:
            break;
        case dataActionType.DATA_MUTATION_FAIL:
            break;
        default:
            return state;
    }
}

export default reducer;