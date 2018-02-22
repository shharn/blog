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
            .catch(err => err.response);
}

export function requestLogout(token : string)  {
    return request
        .post(`http://${env.apiServerDomain}/logout`)
        .send( { token } )
        .then(res => res.body)
        .catch(err => err);
}

export function getMenus() {
    return request
        .get(`http://${env.apiServerDomain}/menus`)
        .accept('json')
        .then(res =>res.body)
        .catch(err => err.response);
}

export function getArticles(menu: string) {
    return request
        .get(`http://${env.apiServerDomain}/menus/${menu}/articles`)
        .accept('json')
        .then(res => res)
        .catch(err => err.response);
}