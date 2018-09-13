// @flow
import { combineReducers } from 'redux';
import auth from './auth';
import data from './data';
import ui from './ui'

import type {
    ClientError,
    Article,
    Menu
} from '../flowtype';

const rootReducer = combineReducers({ auth, data, ui });

export type StoreState = {
    app: {
        auth: {
            error: ClientError,
            isAuthenticated: boolean,
            loginStatus: any,
        },
        data: {
            get: {
                article: ?Article,
                articles: ?Array<Article>,
                hottestArticles: ?Array<Article>,
                menus: ?Array<Menu>
            },
            mutation: {
                articles: {

                },
                menus: {

                }
            }
        },
        ui: {

        }
    },
    router: any
}

export default rootReducer;