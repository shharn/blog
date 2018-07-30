export const Auth = {
    INITIALISE_LOGIN_STATUS: 'INITIALISE_LOGIN_STATUS',
    REQUEST_LOGIN: 'REQUEST_LOGIN',
    LOGIN_PENDING: 'LOGIN_PENDING',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    
    REQUEST_LOGOUT: 'REQUEST_LOGOUT',
    LOGOUT_WAIT: 'LOGOUT_WAIT',
    LOGOUT_FAILED: 'LOGOUT_FAILED',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',

    VALIDATE_TOKEN: 'VALIDATE_TOKEN',
    VALID_TOKEN: 'VALID_TOKEN',
    INVALID_TOKEN: 'INVALID_TOKEN',
    CLIENT_HAS_NO_TOKEN: 'CLIENT_HAS_NO_TOKEN'
}

export const Data = {
    REQUEST_GET_DATA: 'REQUEST_GET_DATA',
    REQUEST_GET_DATA_WITH_URL: 'REQUEST_GET_DATA_WITH_URL',
    REQUEST_GET_DATA_WITH_NAME_AND_URL: 'REQUEST_GET_DATA_WITH_NAME_AND_URL',
    
    GET_DATA_RESPONSE_WAIT: 'GET_DATA_RESPONSE_WAIT',
    GET_DATA_RESPONSE_ERROR: 'GET_DATA_RESPONSE_ERROR',
    GET_DATA_RESPONSE_SUCCESS: 'GET_DATA_RESPONSE_SUCCESS',
    
    REQUEST_MUTATE_DATA: 'REQUEST_DATA_MUTATION',
    DATA_MUTATION_SUCCESS: 'DATA_MUTATION_SUCCESS',
    DATA_MUTATION_FAIL: 'DATA_MUTATION_FAIL',
    DATA_MUTATION_WAIT: 'DATA_MUTATION_WAIT',
    CHANGE_MUTATION_STATUS: 'CHANGE_MUTATION_STATUS'
}

export const UI = {
    OPEN_MENU_MANAGEMENT_DIALOG: 'OPEN_MENU_MANAGEMENT_DIALOG',
    CLOSE_MENU_MANAGEMENT_DIALOG: 'CLOSE_MENU_MANAGEMENT_DIALOG',

    CHANGE_EDITABLE_CELL: 'CHANGE_EDITABLE_CELL',
    DISABLE_EDITABLE_CELL: 'DISABLE_EDITABLE_CELL',

    SWITCH_MENU_MANAGER_CHILD_COMPONENT: 'SWITCH_MENU_MANAGER_CHILD_COMPONENT',

    SET_DATA_FOR_CREATE_OR_EDIT_MENU: 'SET_DATA_FOR_CREATE_OR_EDIT_MENU',
    SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE: 'SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE'
}