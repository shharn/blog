// @flow
import request from 'superagent';
import env from '../config/env';

export function requestLogin(loginInfo) {
    return request
            .post(`http://${env.apiServerDomain}/login`)
            .type('text/plain')
            .accept('json')
            .send(JSON.stringify(loginInfo))
            .then(res => res)
            .catch(err => err.response ? err.response : err);
}

export function validateToken(token: string) {
    return request
        .post(`http://${env.apiServerDomain}/check`)
        .type('text/plain')
        .accept('json')
        .send(JSON.stringify({ token }))
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function requestLogout(token: string)  {
    return request
        .post(`http://${env.apiServerDomain}/logout`)
        .send( { token } )
        .then(res => res)
        .catch(err => err);
}

export function getMenus() {
    return request
        .get(`http://${env.apiServerDomain}/menus`)
        .accept('json')
        .then(res =>res)
        .catch(err => err);
}

export function deleteMenu(id, token) {
    // Is it possible to send body on DELETE request???
    // Let's try experiment
    // return request
    //     .delete(`http://${env.apiServerDomain}/menus/${id}`)
}

export function createMenu(menu) {
    return request
        .post(`http://${env.apiServerDomain}/menus`)
        .accepti('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function editMenu(menu) {
    return request
        .patch(`http://${env.apiServerDomain}/menus`)
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function getArticles(menu: string) {
    return request
        .get(`http://${env.apiServerDomain}/menus/${menu}/articles`)
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}