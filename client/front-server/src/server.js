import path from 'path';
import express from 'express';
// import multer from 'multer';
import chalk from 'chalk';
// import mkdirp from 'mkdirp';
import { INDEX_HTML_FILE_PATH } from './constant';
import Loadable from 'react-loadable';
import { auth } from './middleware';
import logger from './logger';
import {
  uploader,
  uploadeImage
} from './image-uploader';

import { articleDetail } from './handler';
import { HTTPStatusCode } from './constant';

const { OK } = HTTPStatusCode;
const PORT = 3000;
const ASSET_DIR = '../public/asset/image';

// will be deprecated
// const storage = multer.diskStorage({
//     destination: (_, __, cb) => {
//         mkdirp.sync(path.resolve(__dirname, ASSET_DIR));
//         cb(null, path.resolve(__dirname, ASSET_DIR))
//     },
//     filename: (_, file, cb) => {
//         cb(null, file.fieldname);
//     }
// });

const app = express();

app.disable('x-powered-by');

app.use(express.static(path.resolve(__dirname, '../../public/app')));
app.use('/image', express.static(path.resolve(__dirname, '../../public/asset/image')));

app.get('/', (_, res) => {
    res.sendFile(INDEX_HTML_FILE_PATH);
});

app.post('/upload', auth, uploader.any(), uploadeImage, (_, res) => {
    res.sendStatus(OK);
});

app.get('/menus/:menuName/articles/:articleTitle', articleDetail);

// 404 handler
app.all('*', (req, res) => {
    logger.warn(`Request for not found endpoint. ${req.originalUrl}`);
    res.redirect('/');
});

// error handler
app.use((err, req, res, next) => {
    logger.error(`Unhandled error : ${err.message}`);
    // res.sendFile(INTERNAL_SERVER_ERROR_HTML_FILE);
});

Loadable.preloadAll().then(() => {
    app.listen(PORT, (err) => {
        if (!!err) {
            logger.error(`Error during listening on port ${PORT}. Error - ${err.message}`);
            throw err;
        }
        logger.info(chalk.green(`Front-server is running on port ${PORT}\nCurrent environment : ${isDevelopment ? 'development' : 'production'}`));
    });
});
