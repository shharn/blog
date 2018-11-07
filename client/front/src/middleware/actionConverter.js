// @flow
import type { Action } from '../action/types';
import type { AppState } from '../reducer';

type ActionConverterOpts = {
    checker: (action: Action) => boolean,
    converter: (action: Action, srcData: AppState) => Action
};

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
    console.log(``)
}

export function createActionConverter({
    checker,
    converter
}: ActionConverterOpts) {
    return ({ _, getState }) => next => action => {
        if (checker(action)) {
            !isProduction && console.log(`[ActionConverter] Before : ${JSON.stringify(action)}`);
            action = converter(action, getState());
            !isProduction && console.log(`[ActionConverter] After : ${JSON.stringify(action)}`);
        }
        return next(action);
    }
}