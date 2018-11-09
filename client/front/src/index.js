// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './component/App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createAppStore from './createAppStore';
import type { AppState } from './reducer';

export type StoreState = {
    app: AppState,
    router: any
};

const { store, history } = createAppStore();

const container = document.getElementById('root');
if (container) {
    ReactDOM.hydrate(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <App/>
            </ConnectedRouter>
        </Provider>,
        container
    );
    registerServiceWorker();
} else {
    throw new Error(`Cannot find an element with id 'root'`);
}

