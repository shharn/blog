import path from 'path';
import express from 'express';
import chalk from 'chalk';
import { 
    INDEX_HTML_FILE_PATH,
    ERROR_PAGE_FILE_PATH,
    IS_DEVELOPMENT
} from './constant';
import Loadable from 'react-loadable';
import { auth } from './middleware';
import logger from './logger';
import {
  uploader,
  uploadeImage
} from './image-uploader';

import { articleDetail } from './handler';
import { HTTPStatusCode } from './constant';

const { OK, INTERNAL_SERVER_ERROR } = HTTPStatusCode;
const PORT = 3000;

const app = express();

app.disable('x-powered-by');

app.use(express.static(path.resolve(__dirname, '../../public/app')));

app.get('/', (_, res) => {
    res.sendFile(INDEX_HTML_FILE_PATH);
});

app.post('/upload', 
    auth, 
    uploader.any(), 
    uploadeImage, (req, res) => {
        if (req.failedFileName) {
            res.sendStatus(INTERNAL_SERVER_ERROR).end();
        } else {
            const fileListString = req.files.map(file => file.cloudStoragePublicURL).join('\n');
            logger.info(`All files are successfully uploaded. The below list is the public URL of images.\n
                ${fileListString}`);
            res.sendStatus(OK).end();
        }
    }
);

app.get('/menus/:menuName/articles/:articleTitle', articleDetail);

// 404 handler
app.all('*', (req, res) => {
    logger.warn(`Request for not found endpoint. ${req.originalUrl}`);
    res.redirect('/');
});

// error handler
app.use((err, req, res, next) => {
    logger.error(`Unhandled error : ${err.message}`);
    res.sendFile(ERROR_PAGE_FILE_PATH);
});

Loadable.preloadAll().then(() => {
    app.listen(PORT, (err) => {
        if (!!err) {
            logger.error(`Error during listening on port ${PORT}. Error - ${err.message}`);
            throw err;
        }
        logger.info(chalk.green(`Front-server is running on port ${PORT}`));
    });
});
