import path from 'path';
import express from 'express';
import multer from 'multer';
import chalk from 'chalk';
import mkdirp from 'mkdirp';
import request from 'superagent';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import App from '../../front/src/component/App';
import createAppStore from '../../front/src/createAppStore';

const isDevelopment = process.env.NODE_ENV === 'development';
const PORT = 3000;
const ASSET_DIR = '../public/asset/image';
const INDEX_HTML_FILE_PATH = path.join(__dirname, '../../public/app/index.html');
const TOKEN_HEADER_NAME = "X-Session-Token";
const HTTP_STATUS_SUCCESS = 200;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const API_SERVER_HOST = isDevelopment ? 'http://api-server:5000' : 'http://blog-api-server';
const UNAUTHORIZED_BODY = {
    message: 'Invalid Token'
};
const INTERNAL_SERVER_ERROR_BODY = {
    message: 'The server is temporarily unavailable. Please try later :('
};

// will be deprecated
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        mkdirp.sync(path.resolve(__dirname, ASSET_DIR));
        cb(null, path.resolve(__dirname, ASSET_DIR))
    },
    filename: (_, file, cb) => {
        cb(null, file.fieldname);
    }
});

const upload = multer({
    storage
});

const app = express();

app.disable('x-powered-by');

app.use(express.static(path.resolve(__dirname, '../../public/app')));
app.get('/', (_, res) => {
    res.sendFile(INDEX_HTML_FILE_PATH);
});
app.use('/image', express.static(path.resolve(__dirname, '../../public/asset/image')));
app.post('/upload', (req, res, next) => {
    const token = req.header(TOKEN_HEADER_NAME);
    if (!!token && token.length > 0) {
        request
            .get(`${API_SERVER_HOST}/check`)
            .set(TOKEN_HEADER_NAME, token)
            .timeout({
                deadline: 10000
            })
            .accept('json')
            .then(res => {
                if (res.statusCode === 200 && res.body.isValid) {
                    next();
                } else {
                    res
                        .status(HTTP_STATUS_UNAUTHORIZED)
                        .json(UNAUTHORIZED_BODY);
                }
            })
            .catch(err => {
                res
                    .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
                    .json(INTERNAL_SERVER_ERROR_BODY);
            });
    } else {
        res
            .status(HTTP_STATUS_UNAUTHORIZED)
            .json(UNAUTHORIZED_BODY);
    }
}, 
upload.any(), 
(_, res) => {
    res.sendStatus(HTTP_STATUS_SUCCESS);
});

app.get('/menus/:menuName/articles/:articleTitle', (req, res) =>{
    fs.readFile(INDEX_HTML_FILE_PATH, 'utf8', async (err, originalHTML) => {
        if (!!err) {
            console.error(`Error during reading index.html file\n.Error : ${err.message}`);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).end()
        }

        const articleTitle = req.params["articleTitle"];
        if (!!!articleTitle || articleTitle.length < 1) {
            return res.redirect('/');
        }
        const article =  await getArticleByTitle(articleTitle);
        if (!!!article) {
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
                            }
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
                `<div id="root">
                    ${renderedReactAppHTML}
                </div>
                <script >
                    window.__PRELOADED_STATE__ = ${JSON.stringify(newState).replace(/</g, '\\u003c')};
                </script>`
            )
        );
    });
});

app.all('*', (_, res) => {
    res.redirect('/');
});

function getArticleByTitle(title) {
    const path = `${API_SERVER_HOST}/articles/titles/${title}`;
    return request
        .get(path)
        .timeout({
            deadline: 3000
        })
        .accept('json')
        .then(res => {
            if (res.statusCode === 200) {
                return res.body;
            }
            return null;
        })
        .catch(err => {
            console.error(`Error during API request '${path}\nError - ${err.message}`);
            return null;  
        });
}

Loadable.preloadAll().then(() => {
    app.listen(PORT, (err) => {
        if (!!err) {
            console.error(`Error during listening on port ${PORT}\nError - ${err.message}`);
            throw err;
        }
        console.log(chalk.green(`Front-server is running on port ${PORT}\nCurrent environment : ${isDevelopment ? 'development' : 'production'}`));
    });
});
