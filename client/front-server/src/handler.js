import fs from 'fs';
import logger from './logger';
import http from 'http';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
    INTERNAL_API_SERVER_SERVICE,
    INDEX_HTML_FILE_PATH,
    HTTPStatusCode
} from './constant';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import App from '../../front/src/component/App';
import createAppStore from '../../front/src/createAppStore';

const { INTERNAL_SERVER_ERROR } = HTTPStatusCode;

export function articleDetail(req, res) {
    fs.readFile(INDEX_HTML_FILE_PATH, 'utf8', async (err, originalHTML) => {
        if (err) {
            logger.error(`Error during reading index.html file\n.Error : ${err.message}`);
            return res.status(INTERNAL_SERVER_ERROR).end()
        }

        const articleTitle = req.params["articleTitle"];
        if (!articleTitle || articleTitle.length < 1) {
            return res.redirect('/');
        }
        let article;
        try {
            article = await getArticleByTitle(articleTitle);
            if (!article) {
                logger.info(`article is null. The title param value - ${articleTitle}`);
                return res.redirect('/');
            }
        } catch (ex) {
            logger.error(`Error during the fetching the article - ${ex.message}`);
            return res.redirect('/');
        }

        const { store, history } = createAppStore();
        const initialState = store.getState();
        const newState = {
            ...initialState,
            app: {
                ...initialState.app,
                data: {
                    ...initialState.app.data,
                    get: {
                        ...initialState.app.data.get,
                        article: {
                            ...initialState.app.data.get.article,
                            data: article,
                            isServerRendered: true
                        }
                    }
                }
            }
        };
        const renderedReactAppHTML = ReactDOMServer.renderToString(
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <App/>
                </ConnectedRouter>
            </Provider>
        );
        return res.send(
            originalHTML.replace(
                `<div id="root"></div>`,
                `<script >
                    window.__PRELOADED_STATE__ = ${JSON.stringify(newState).replace(/</g, '\\u003c')};
                </script>
                <div id="root">
                    ${renderedReactAppHTML}
                </div>`
            )
        );
    });
}

function getArticleByTitle(title) {
    const encoded = encodeURIComponent(title);
    const path = `http://${INTERNAL_API_SERVER_SERVICE}/articles/titles/${encoded}`;
    logger.debug(`Request to API server path : ${path}`);
    return new Promise((resolve, reject) => {
        http.get(path, res => {
            const { statusCode } = res;
            if (statusCode !== 200) {
                logger.error(`Error response from api-server. StatusCode - ${statusCode}`);
                res.resume();
                reject();
                return;
            }
            let rawData = '';
            res.on('data', chunk => rawData +=  chunk);
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    logger.debug(`JSON data from api-server - ${rawData}`);
                    resolve(parsedData);
                } catch (e) {
                    logger.error(e.message);
                    reject();
                }
            })
        }).on('error', e => {
            logger.error(`Get error - ${e.message}`);
            reject();
        });
    });
}
