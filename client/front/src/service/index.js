// @flow
import request from 'superagent';
import env from '../config/env';

import type { LoginInformation } from '../flowtype';

const HEADER_NAME_FOR_TOKEN = 'X-Session-Token';

export function requestLogin(loginInfo: LoginInformation) {
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
        .get(`http://${env.apiServerDomain}/check`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function requestLogout(token: string)  {
    return request
        .post(`http://${env.apiServerDomain}/logout`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function getData(dataName: string) {
    return request
        .get(`http://${env.apiServerDomain}/${dataName}`)
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function getDataWithURL(url: string) {
    return request
        .get(`http://${env.apiServerDomain}/${url}`)
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function createData(dataName: string, data: any, token: string) {
    return request
        .post(`http://${env.apiServerDomain}/${dataName}`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .send(JSON.stringify(data))
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function updateData(dataName: string, data: any, token: string) {
    return request
        .patch(`http://${env.apiServerDomain}/${dataName}/${data.uid}`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .send(JSON.stringify(data))
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function deleteData(dataName: string, uid: string, token: string) {
    return request
        .delete(`http://${env.apiServerDomain}/${dataName}/${uid}`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}