import React from 'react';
import ReactDOM from 'react-dom';
import RootRoute from './route/RootRoute';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import appReducer from './reducer';
import rootSaga from './saga';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import CssBaseline from 'material-ui/CssBaseline';
import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';
import './index.scss';

const history = createHistory();
const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    combineReducers({
        router: routerReducer,
        app: appReducer
    }),
    applyMiddleware(routeMiddleware, sagaMiddleware)
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
    }
});

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <MuiThemeProvider theme={theme}>
                <div>
                    <CssBaseline />
                    <RootRoute />
                </div>
            </MuiThemeProvider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
