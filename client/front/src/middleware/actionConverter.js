// @flow
import type { Action } from '../action/types';
import type { AppState } from '../reducer';

type ActionConverterOpts = {
    checker: (action: Action) => boolean,
    converter: (action: Action, srcData: AppState) => Action
};

export function createActionConverter({
    checker,
    converter
}: ActionConverterOpts) {
    return ({ _, getState }) => next => action => {
        if (checker(action)) {
            action = converter(action, getState());
        }
        return next(action);
    }
}