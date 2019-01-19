import fs from 'fs';
import logger from './logger';
import request from 'superagent';
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
        logger.info(`ArticleTitle param value : ${articleTitle}`);
        if (!articleTitle || articleTitle.length < 1) {
            return res.redirect('/');
        }
        let article;
        try {
            article = await getArticleByTitle(articleTitle);
            if (!article) {
                logger.info(`article is null`);
                return res.redirect('/');
            }
        } catch (ex) {
            logger.error(`Error during the fetching the article - ${ex.message}`);
            return res.redirect('/');
        }

        const { content, createdAt, summary, title, menu } = article;
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
                            data: {
                                content,
                                createdAt,
                                summary,
                                title,
                                menu
                            },
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
    const path = `${INTERNAL_API_SERVER_SERVICE}/articles/titles/${encoded}`;
    logger.info(`Request to API server path : ${path}`);
    return request
        .get(path)
        .timeout({
            deadline: 3000
        })
        .accept('json')
        .then(res => {
            if (res.statusCode === 200) {
                return res.body;
            } else {
                logger.error(`Fail to fetch an article by title. Path : ${path}, statusCode : ${res.statusCode}`);
                return null;
            }
        })
        .catch(err => {
            logger.error(`Error during API request '${path}\nError - ${err.message}`);
            return null;  
        });
}
