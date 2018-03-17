// @flow
import request from 'superagent'
import env from '../config/env'

import type { LoginInformation } from '../action/auth'

type BlogRequest  = {
    token: string,
    data: any   
}

export function requestLogin(loginInfo: LoginInformation) {
    return request
            .post(`http://${env.apiServerDomain}/login`)
            .type('text/plain')
            .accept('json')
            .send(JSON.stringify(loginInfo))
            .then(res => res)
            .catch(err => err.response ? err.response : err)
}

export function validateToken(token: string) {
    return request
        .post(`http://${env.apiServerDomain}/check`)
        .type('text/plain')
        .accept('json')
        .send(JSON.stringify({ token }))
        .then(res => res)
        .catch(err => err.response ? err.response : err)
}

export function requestLogout(token: string)  {
    return request
        .post(`http://${env.apiServerDomain}/logout`)
        .send( { token } )
        .then(res => res)
        .catch(err => err.response ? err.response : err)
}

export function getData(dataName: string) {
    return request
        .get(`http://${env.apiServerDomain}/${dataName}`)
        .accept('json')
        .then(res => res)
        .catch(err => err.response ? err.response : err)
}

export function createData(dataName: string, data: any, token: string) {
    const blogRequest : BlogRequest = {
        token,
        data: {
            [dataName.substr(0, dataName.length - 1)]: data
        }
    }
    return request
        .post(`http://${env.apiServerDomain}/${dataName}`)
        .type('text/plain')
        .accept('json')
        .send(blogRequest)
        .then(res => res)
        .catch(err => err.response ? err.response : err)
}

export function updateData(dataName: string, data: any, token: string) {
    const blogRequest : BlogRequest = {
        token,
        data: {
            [dataName.substr(0, dataName.length - 1)]: data
        }
    }
    return request
        .patch(`http://${env.apiServerDomain}/${dataName}`)
        .type('text/plain')
        .accept('json')
        .send(blogRequest)
        .then(res => res)
        .catch(err => err.response ? err.response : err)
}

export function deleteData(dataName: string, id: number, token: string) {
    const blogRequest: BlogRequest = {
        token,
        data: {
            id
        }
    }
    return request
        .delete(`http://${env.apiServerDomain}/${dataName}`)
        .type('text/plain')
        .accept('json')
        .send(blogRequest)
        .then(res => res)
        .catch(err => err.response ? err.response : err)
}

/////////////////////////////////////////////////////////////////
// will be normalized
// export function getMenus() {
//     return request
//         .get(`http://${env.apiServerDomain}/menus`)
//         .accept('json')
//         .then(res =>res)
//         .catch(err => err);
// }

// export function deleteMenu(id, token) {
//     // Is it possible to send body on DELETE request???
//     // Let's try experiment
//     // return request
//     //     .delete(`http://${env.apiServerDomain}/menus/${id}`)
// }

// export function createMenu(menu, token) {
//     return request
//         .post(`http://${env.apiServerDomain}/menus`)
//         .type('text/plain')
//         .accepti('json')
//         .send(menu)
//         .then(res => res)
//         .catch(err => err.response ? err.response : err);
// }

// export function editMenu(menu, token) {
//     return request
//         .patch(`http://${env.apiServerDomain}/menus`)
//         .type('text/plain')
//         .accept('json')
//         .send(menu)
//         .then(res => res)
//         .catch(err => err.response ? err.response : err);
// }

// export function getArticles(menu: string) {
//     return request
//         .get(`http://${env.apiServerDomain}/menus/${menu}/articles`)
//         .accept('json')
//         .then(res => res)
//         .catch(err => err.response ? err.response : err);
// }