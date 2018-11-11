import path from 'path';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const API_SERVER_HOST = IS_DEVELOPMENT ? 'http://api-server:5000' : 'http://blog-api-server';

export const TOKEN_HEADER_NAME = "X-Session-Token";

export const INDEX_HTML_FILE_PATH = path.join(__dirname, '../../public/app/index.html');

export const HTTPStatusCode = {
    OK: 200,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500
};

export const HTTPBodyPreset = {
    401: {
        message: 'Invalid Token'
    },
    500: {
        message: 'The server is temporarily unavailable. Please try later :('
    }
};
