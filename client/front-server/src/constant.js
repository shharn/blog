import path from 'path';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const INTERNAL_API_SERVER_SERVICE = process.env.INTERNAL_API_SERVER_SERVICE;

export const TOKEN_HEADER_NAME = "X-Session-Token";

export const STATIC_FILES_PATH = path.join(__dirname, '../../public/app');

export const INDEX_HTML_FILE_PATH = path.join(STATIC_FILES_PATH, 'index.html');

export const ERROR_PAGE_FILE_PATH = path.join(STATIC_FILES_PATH, 'error.html');

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
