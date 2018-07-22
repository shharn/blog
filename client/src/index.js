import React from 'react';
import ReactDOM from 'react-dom';
import RootRoute from './route/RootRoute';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { createActionConverter } from './middleware/actionConverter';
import { menuNameToUID, isTargetAction } from './middleware/menuNameConverter';
import logger from 'redux-logger';
import appReducer from './reducer';
import rootSaga from './saga';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

const history = createHistory();
const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const actionConverter = createActionConverter(isTargetAction, menuNameToUID);
const store = createStore(
    combineReducers({
        router: routerReducer,
        app: appReducer
    }),
    applyMiddleware(routeMiddleware, actionConverter, sagaMiddleware, logger)
);
sagaMiddleware.run(rootSaga);

const theme = createMuiTheme({
    palette: {
        primary: {
            light: blue[400],
            main: blue[500]
        },
        secondary: {
            light: pink[400],
            main: pink[500]
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
    document.getElementById('root')
);

registerServiceWorker();
