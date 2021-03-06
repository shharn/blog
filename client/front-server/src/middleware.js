import request from 'superagent';
import {
    INTERNAL_API_SERVER_SERVICE,
    TOKEN_HEADER_NAME,
    HTTPStatusCode,
    HTTPBodyPreset,
} from './constant';
import logger from './logger';

const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = HTTPStatusCode;
const REQUEST_TIMEOUT_MS = 3 * 1000;

export function auth(req, res, next) {
    const token = req.header(TOKEN_HEADER_NAME);
    if (!!token && token.length > 0) {
        request
            .get(`${INTERNAL_API_SERVER_SERVICE}/check`)
            .set(TOKEN_HEADER_NAME, token)
            .timeout({
                deadline: REQUEST_TIMEOUT_MS
            })
            .accept('json')
            .then(res => {
                if (res.statusCode === OK && res.body.isValid) {
                    next();
                } else {
                    logger.warn(`Invalid token received = ${token}`)
                    res
                        .status(UNAUTHORIZED)
                        .json(HTTPBodyPreset[UNAUTHORIZED]);
                }
            })
            .catch(err => {
                logger.error(`Error during authentication. Message : ${err.message}`);
                res
                    .status(INTERNAL_SERVER_ERROR)
                    .json(HTTPBodyPreset[INTERNAL_SERVER_ERROR]);
            });
    } else {
        logger.warn(`Invalid token. Token : ${token}`);
        res
        .status(UNAUTHORIZED)
        .json(HTTPBodyPreset[UNAUTHORIZED]);
    }
}