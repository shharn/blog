// @flow
import type { Action } from '../action/types';
import type { 
    State,
    Dispatch,
    GetState
} from '../flowtype';

type ActionConverterOpts = {
    checker: (action: Action) => boolean,
    converter: (action: Action, srcData: State) => Action
};

export function createActionConverter({
    checker,
    converter
}: ActionConverterOpts) {
    return ({ _, getState }: { dispatch: Dispatch, getState: GetState }) => (next: (action: Action) => Object) => (action: Action) => {
        if (checker(action)) {
            action = converter(action, getState());
        }
        return next(action);
    }
}