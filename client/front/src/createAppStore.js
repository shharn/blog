import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { 
    createBrowserHistory,
    createMemoryHistory
} from 'history';
import { createAutoUpdater } from './middleware/dataAutoUpdater';
import {
    menuNameActionConverter,
    articleNameActionConverter
} from './middleware/blogActionConverter';
import logger from 'redux-logger';
import appReducer from './reducer';
import rootSaga from './saga';

const isSSR = typeof window === 'object';

export default function createAppStore(preloadedState) {
    const history = isSSR ? createBrowserHistory() : createMemoryHistory();
    const routeMiddleware = routerMiddleware(history);
    const sagaMiddleware = createSagaMiddleware();
    const dataAutoUpdater = createAutoUpdater();
    const menuNameToUIDMiddlerware = menuNameActionConverter();
    const articleNameToUIDMiddleware = articleNameActionConverter();
    const isProduction = process.env.NODE_ENV === 'production';
    const middlewares = [
        ...(isProduction ? [] : [ logger ]),
        routeMiddleware,
        dataAutoUpdater,
        menuNameToUIDMiddlerware,
        articleNameToUIDMiddleware,
        sagaMiddleware
    ];
    const store = createStore(
        combineReducers({
            router: routerReducer,
            app: appReducer
        }),
        preloadedState,
        applyMiddleware(...middlewares)
    );
    sagaMiddleware.run(rootSaga);
    return { store, history };
}