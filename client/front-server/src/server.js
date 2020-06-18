import express from 'express';
import chalk from 'chalk';
import { 
    STATIC_FILES_PATH,
    INDEX_HTML_FILE_PATH,
    ERROR_PAGE_FILE_PATH,
    IS_DEVELOPMENT
} from './constant';
import { OAUTH_RESULT_LOCALSTORAGE_KEY } from '../../front/src/constant';
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
const HEALTH_CHECK_PATH = '/healthz';
const PORT = 3000;
const healthCheckUAs = [ 'kube-probe', 'GoogleHC' ];

const isHealthCheckRequest = ua => {
    if (!ua || !ua.length) return false;
    for (let target of healthCheckUAs) {
        if (ua.startsWith(target)) return true;
    }
    return false;
};

const app = express();

app.disable('x-powered-by');

app.use((req, res, next) => {
    const ua = req.headers['user-agent'];
    if (!isHealthCheckRequest(ua)) {
        logger.info(`Request URL : ${req.originalUrl}, Protocol: ${req.protocol}, Headers: ${JSON.stringify(req.headers)}`);
    }
    const protocol = req.headers['x-forwarded-proto'] || '';
    const isHttp = protocol === 'http';
    if (req.originalUrl !== HEALTH_CHECK_PATH && isHttp && !IS_DEVELOPMENT) {
        res.redirect(`https://${req.hostname}${req.originalUrl}`);
        return;
    }
    next();
});

app.use(express.static(STATIC_FILES_PATH, {
    dotfiles: 'ignore',
    index: false,
    etag: true,
    lastModified: true,
    cacheControl: true,
    maxAge: 60 * 60 * 24 * 365
}));

app.get(HEALTH_CHECK_PATH, (_, res) => {
    res.sendStatus(OK).end();
});

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

const getEndpointForAuthCodeExchange = (platform, code) => `${process.env.API_SERVER_URL}/oauth/authorizations/${platform}/codes/${encodeURIComponent(code)}`;

app.get('/oauth/authorizations/:platform/callback', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    const templatePlaceholder = '$$PLACEHOLDER';
    let template = `
    <html>
        <head>
            <!-- Google Tag Manager -->
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K64ZBVD');</script>
            <!-- End Google Tag Manager -->
        </head>
        <body>
            <!-- Google Tag Manager (noscript) -->
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K64ZBVD"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->
            <script>
               ${templatePlaceholder}
            </script>
        </body>
        </html>
    `;
    const clientState = req.query.state;
    const serverState = process.env.OAUTH_CSRF_STATE;
    logger.debug(`clientState - ${clientState}, serverState - ${serverState}`);
    if (clientState !== serverState) {
        template = template.replace(templatePlaceholder, `
            localStorage.setItem('${OAUTH_RESULT_LOCALSTORAGE_KEY}', ${JSON.stringify({isValid: false, admin: false})});
        `);
        res.send(template).end();
        return;
    }

    const platform = req.params['platform'];
    const code = req.query.code;
    logger.debug(`oauth callback, platform - ${platform}, code - ${code}`);
    template = template.replace(templatePlaceholder, `
        fetch('${getEndpointForAuthCodeExchange(platform, code)}')
            .then(function (res) {
                return res.json();
            })
            .then(function (res) {
                localStorage.setItem('${OAUTH_RESULT_LOCALSTORAGE_KEY}', JSON.stringify(res));
                window.close();
            })
            .catch(function (err) {
                localStorage.setItem('${OAUTH_RESULT_LOCALSTORAGE_KEY}', '${JSON.stringify({isValid: false, isAdmin: false})}');
                window.close();
            });
    `);
    res.send(template).end();
});

// 404 handler
app.all('*', (req, res) => {
    logger.warning(`Request for not found endpoint. ${req.originalUrl}`);
    res.redirect('/');
});

app.use((err, _, res, __) => {
    logger.error(`Unhandled error : ${err.message}. Line : ${err.lineNumber}, StackTrace : ${err.stack}`);
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
