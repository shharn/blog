export function createActionConverter(checker, converter) {
    return ({ dispatch, getState }) => next => action => {
        if (checker(action)) {
            action = converter(action, getState());
        }
        return next(action);
    }
}