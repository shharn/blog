// @flow
import request from 'superagent';
import env from '../config/env';

import type { LoginInformation, BlogRequest } from '../flowtype';

const HEADER_NAME_FOR_TOKEN = 'X-Session-Token';

export function requestLogin(loginInfo: LoginInformation) {
    return request
            .post(`http://${env.apiServerDomain}/login`)
            .type('text/plain')
            .accept('json')
            .send(JSON.stringify({ data: { loginInformation: loginInfo }}))
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
        .catch(err => err.response ? err.response : err);
}

export function getData(dataName: string) {
    return request
        .get(`http://${env.apiServerDomain}/${dataName}`)
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function createData(dataName: string, data: any, token: string) {
    const blogRequest : BlogRequest = {
        data: {
            [dataName.substr(0, dataName.length - 1)]: data
        }
    };
    return request
        .post(`http://${env.apiServerDomain}/${dataName}`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .send(JSON.stringify(blogRequest))
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function updateData(dataName: string, data: any, token: string) {
    const blogRequest : BlogRequest = {
        data: {
            [dataName.substr(0, dataName.length - 1)]: data
        }
    };
    return request
        .patch(`http://${env.apiServerDomain}/${dataName}`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .send(JSON.stringify(blogRequest))
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function deleteData(dataName: string, id: number, token: string) {
    const blogRequest: BlogRequest = {
        data: {
            id
        }
    };
    return request
        .delete(`http://${env.apiServerDomain}/${dataName}`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .send(JSON.stringify(blogRequest))
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}