export type Menu = {
    id?: number,
    name: string,
    url: string,
    parentId: number
}

export type BlogError = {
    code: number,
    message: string
};

export type LoginInformation = {
    email: string,
    password: string
}

export type LoginResponse = {
    isAuthenticated: boolean,
    token: string
}

export type BlogAction = {
    type: string,
    payload: any
}

export type BlogRequest  = {
    token: string,
    data: any   
}