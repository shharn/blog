import { createUnique } from '../util';

export const AuthStatus = {
    INITIAL: createUnique('INITIAL'),
    LOGIN_WAIT: createUnique('LOGIN_WAIT'),
    LOGIN_SUCCESS: createUnique('LOGIN_SUCCESS'),
    LOGIN_FAILED: createUnique('LOGIN_FAIL'),
    LOGOUT_WAIT: createUnique('LOGOUT_WAIT'),
    LOGOUT_SUCCESS: createUnique('LOGOUT_SUCCESS'),
    LOGOUT_FAILED: createUnique('LOGOUT_FAIL'),
    OAUTH_AUTHORIZATION_SUCCESS: createUnique('OAUTH_AUTHORIZATION_SUCCESS')
};

export const AuthPlatform = {
    NONE: 'none',
    NATIVE: 'native',
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    GITHUB: 'github'
};

export const FetchStatus = {
    INITIAL: createUnique('FETCH_INITIAL'),
    WAIT: createUnique('FETCH_WAIT'),
    SUCCESS: createUnique('FETCH_SUCCESS'),
    FAIL: createUnique('FETCH_FAIL')
};

export const HEADER_NAME_FOR_TOKEN = 'X-Session-Token';
export const OAUTH_RESULT_LOCALSTORAGE_KEY = 'puppy:oauth:result';
export const Token = {
    key: 'puppyToken'
};

export const Styles = {
    drawerWidth: 240
};

export const MutationOperationType = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete'
};

export const DataName = {
    MENU: 'menus',
    ARTICLE: 'articles'
};

export const MenuManagerChildComponentType = {
    LIST: 'LIST',
    CREATE_MENU: 'CREATE_MENU',
    EDIT_MENU: 'EDIT_MENU'
};

export const PLACEHOLDER_NAME_TO_CONVERT = '{{uid}}';

export const ImageUploadStatus = {
    INITIAL: createUnique('INITIAL'),
    UPLOADING: createUnique('UPLOADING'),
    SUCCESS: createUnique('SUCCESS'),
    FAIL: createUnique('FAIL')
}