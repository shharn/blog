// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import RootRoute from './route/RootRoute';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { createAutoUpdater } from './middleware/dataAutoUpdater';
import { createActionConverter } from './middleware/actionConverter';
import { menuNameToUIDConverter, menuConverterChecker } from './middleware/menuNameConverter';
import { articleNameToUIDConverter, articleConverterChecker } from './middleware/articleNameConverter';
import logger from 'redux-logger';
import appReducer from './reducer';
import type { AppState } from './reducer';
import rootSaga from './saga';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

export type StoreState = {
    app: AppState,
    router: any
};

const history = createHistory();
const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const dataAutoUpdater = createAutoUpdater();
const actionConverterForMenu = createActionConverter(menuConverterChecker, menuNameToUIDConverter);
const actionConverterForArticle = createActionConverter(articleConverterChecker, articleNameToUIDConverter);
const isProduction = process.env.NODE_ENV === 'production';
const middlewares = [
    ...(isProduction ? [] : [ logger ]),
    routeMiddleware,
    dataAutoUpdater,
    actionConverterForMenu,
    actionConverterForArticle,
    sagaMiddleware
];
const store = createStore(
    combineReducers({
        router: routerReducer,
        app: appReducer
    }),
    applyMiddleware(...middlewares)
);
sagaMiddleware.run(rootSaga);

const theme = createMuiTheme({
    palette: {
        primary: {
            light: blue[400],
            main: blue[500],
            dark: blue[600]
        },
        secondary: {
            light: pink[400],
            main: pink[500],
            dark: pink[600]
        }
    },
    breakpoints: {
        values: {
            sm: 600,
            md: 900,
            lg: 1100
        }
    }
});

const container = document.getElementById('root');
if (container) {
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <MuiThemeProvider theme={theme}>
                    <React.Fragment>
                        <CssBaseline />
                        <RootRoute />
                    </React.Fragment>
                </MuiThemeProvider>
            </ConnectedRouter>
        </Provider>,
        container
    );
    registerServiceWorker();
} else {
    throw new Error(`Cannot find an element with id 'root'`);
}

