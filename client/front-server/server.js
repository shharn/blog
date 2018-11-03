var path = require('path');
var express = require('express');
var multer = require('multer');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var request = require('superagent');

var PORT = 3000;
const ASSET_DIR = '../public/asset/image';
const TOKEN_HEADER_NAME = "X-Session-Token";
const HTTP_STATUS_SUCCESS = 200;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const API_SERVER_HOST = 'http://blog-api-server';
const UNAUTHORIZED_BODY = {
    message: 'Invalid Token'
};
const INTERNAL_SERVER_ERROR_BODY = {
    message: 'The server is temporarily unavailable. Please try later :('
};

var storage = multer.diskStorage({
    destination: (_, __, cb) => {
        var res = mkdirp.sync(path.resolve(__dirname, ASSET_DIR));
        cb(null, path.resolve(__dirname, ASSET_DIR))
    },
    filename: (_, file, cb) => {
        cb(null, file.fieldname);
    }
});

var upload = multer({
    storage
});
var app = express();

app.disable('x-powered-by');

app.use(express.static(path.resolve(__dirname, '../public/app')));
app.use('/image', express.static(path.resolve(__dirname, '../public/asset/image')));
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

app.get('/menus/:menuName/articles/:articleTitle', (req, res) => {
    res.sendStatus(HTTP_STATUS_SUCCESS);
});

app.all('*', (_, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(chalk.green(`Front-server is running on port ${PORT}`));
});
