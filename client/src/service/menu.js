import request from 'superagent';
import env from '../config/env';

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

export function createMenu(menu, token) {
    return request
        .post(`http://${env.apiServerDomain}/menus`)
        .type('text/plain')
        .accepti('json')
        .send(menu)
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function editMenu(menu, token) {
    return request
        .patch(`http://${env.apiServerDomain}/menus`)
        .type('text/plain')
        .accept('json')
        .send(menu)
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}