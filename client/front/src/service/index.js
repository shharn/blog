// @flow
import request from 'superagent';
import {
    HEADER_NAME_FOR_TOKEN,
    AuthPlatform
} from '../constant';
import type { LoginInformation } from '../flowtype';

const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https:' : 'http:';
const API_SERVER_URL: string = process.env.API_SERVER_URL || 'https://blog.puppyloper.com';

export function requestLogin(loginInfo: LoginInformation): Promise<request.Response | Error> {
    return request
            .post(`${PROTOCOL}//${API_SERVER_URL}/login`)
            .type('text/plain')
            .accept('json')
            .send(JSON.stringify(loginInfo))
            .then(res => res)
            .catch(err => err.response ? err.response : err);
}

export function requestOAuthAuthorization(platform: $Values<AuthPlatform>): Promise<request.Response | Error> {
    return request
        .post(`${PROTOCOL}//${API_SERVER_URL}/oauth/authorizations/${platform}`)
        .type('text/plain')
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function validateToken(token: string): Promise<request.Response | Error> {
    return request
        .get(`${PROTOCOL}//${API_SERVER_URL}/check`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function requestLogout(token: string): Promise<request.Response | Error> {
    return request
        .post(`${PROTOCOL}//${API_SERVER_URL}/logout`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function getData(dataName: string): Promise<request.Response | Error> {
    return request
        .get(`${PROTOCOL}//${API_SERVER_URL}/${dataName}`)
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function getDataWithURL(url: string): Promise<request.Response | Error> {
    return request
        .get(`${PROTOCOL}//${API_SERVER_URL}/${url}`)
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function createData(dataName: string, data: any, token: string): Promise<request.Response | Error> {
    return request
        .post(`${PROTOCOL}//${API_SERVER_URL}/${dataName}`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .send(JSON.stringify(data))
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function updateData(dataName: string, data: any, token: string): Promise<request.Response | Error> {
    return request
        .patch(`${PROTOCOL}//${API_SERVER_URL}/${dataName}/${data.uid}`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .send(JSON.stringify(data))
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function deleteData(dataName: string, uid: string, token: string): Promise<request.Response | Error> {
    return request
        .delete(`${PROTOCOL}//${API_SERVER_URL}/${dataName}/${uid}`)
        .set(HEADER_NAME_FOR_TOKEN, token)
        .type('text/plain')
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}

export function uploadImage(files: Array<File>, token: string): Promise<request.Response | Error> {
    let req = request
        .post(`/upload`)
        .set(HEADER_NAME_FOR_TOKEN, token);
    for (let file of files) {
        req = req.attach(file.name, file);
    }
    return req
        .then(res => res)
        .catch(err => err.response ? err.response : err);
}