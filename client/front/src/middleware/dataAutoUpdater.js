import { Data } from '../action/types'; 
import { requestData } from '../action/data';

const targetDataNames: Array<string> = [ 'menus' ];

export function createAutoUpdater() {
    return ({ dispatch }) => next => action => {
        if (isMutationSuccessAction(action) && isTargetData(action))  {
            dispatch(requestData(action.payload.dataName));
        }
        return next(action);
    }
}

function isMutationSuccessAction(action) {
    return action.type === Data.DATA_MUTATION_SUCCESS;
}

function isTargetData(action) {
    return targetDataNames.indexOf(action.payload.dataName) > -1;
}