import { createUnique } from '../util';

export const Auth = {
    INITIALIZE_LOGIN_STATUS: createUnique('INITIALISE_LOGIN_STATUS'),
    REQUEST_LOGIN: createUnique('REQUEST_LOGIN'),
    LOGIN_PENDING: createUnique('LOGIN_PENDING'),
    LOGIN_FAILED: createUnique('LOGIN_FAILED'),
    LOGIN_SUCCESS: createUnique('LOGIN_SUCCESS'),
    
    REQUEST_LOGOUT: createUnique('REQUEST_LOGOUT'),
    LOGOUT_WAIT: createUnique('LOGOUT_WAIT'),
    LOGOUT_FAILED: createUnique('LOGOUT_FAILED'),
    LOGOUT_SUCCESS: createUnique('LOGOUT_SUCCESS'),

    VALIDATE_TOKEN: createUnique('VALIDATE_TOKEN'),
    VALID_TOKEN: createUnique('VALID_TOKEN'),
    INVALID_TOKEN: createUnique('INVALID_TOKEN'),
    CLIENT_HAS_NO_TOKEN: createUnique('CLIENT_HAS_NO_TOKEN'),

    REQUEST_OAUTH_LOGIN: createUnique('REQUEST_OAUTH_LOGIN'),
    OAUTH_AUTHORIZATION_SUCCESS: createUnique('OAUTH_AUTHORIZATION_SUCCESS')
}

export const Data = {
    REQUEST_GET_DATA: createUnique('REQUEST_GET_DATA'),
    REQUEST_GET_DATA_WITH_URL: createUnique('REQUEST_GET_DATA_WITH_URL'),
    REQUEST_GET_DATA_WITH_NAME_AND_URL: createUnique('REQUEST_GET_DATA_WITH_NAME_AND_URL'),
    
    GET_DATA_RESPONSE_WAIT: createUnique('GET_DATA_RESPONSE_WAIT'),
    GET_DATA_RESPONSE_ERROR: createUnique('GET_DATA_RESPONSE_ERROR'),
    GET_DATA_RESPONSE_SUCCESS: createUnique('GET_DATA_RESPONSE_SUCCESS'),
    
    REQUEST_MUTATE_DATA: createUnique('REQUEST_DATA_MUTATION'),
    DATA_MUTATION_SUCCESS: createUnique('DATA_MUTATION_SUCCESS'),
    DATA_MUTATION_FAIL: createUnique('DATA_MUTATION_FAIL'),
    DATA_MUTATION_WAIT: createUnique('DATA_MUTATION_WAIT'),
    INITIALIZE_MUTATION_STATUS: createUnique('INITIALIZE_MUTATION_STATUS'),

    UPLOAD_IMAGE: createUnique('UPLOAD_IMAGE'),
    UPLOAD_IMAGE_SUCCESS: createUnique('UPLOAD_IMAGE_SUCCESS'),
    UPLOAD_IMAGE_FAIL: createUnique('UPLOAD_IMAGE_FAIL'),
    INITIALIZE_IMAGE_DIALOG_STATUS: createUnique('INITIALIZE_IMAGE_DIALOG_STATUS'),

    INITIALIZE_DATA: createUnique('INITIALIZE_DATA'),
    INITIALIZE_SERVER_RENDERING_FLAG: createUnique('INITIALIZE_SERVER_RENDERING_FLAG'),

    SET_DATA: createUnique('SET_DATA')
}

export const UI = {
    OPEN_MENU_MANAGEMENT_DIALOG: createUnique('OPEN_MENU_MANAGEMENT_DIALOG'),
    CLOSE_MENU_MANAGEMENT_DIALOG: createUnique('CLOSE_MENU_MANAGEMENT_DIALOG'),

    CHANGE_EDITABLE_CELL: createUnique('CHANGE_EDITABLE_CELL'),
    DISABLE_EDITABLE_CELL: createUnique('DISABLE_EDITABLE_CELL'),

    SWITCH_MENU_MANAGER_CHILD_COMPONENT: createUnique('SWITCH_MENU_MANAGER_CHILD_COMPONENT'),

    SET_DATA_FOR_CREATE_OR_EDIT_MENU: createUnique('SET_DATA_FOR_CREATE_OR_EDIT_MENU'),
    SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE: createUnique('SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE')
}