export type Menu = {
    uid?: string,
    name: string,
    url: string,
    parent: Array<Menu>,
    children: Array<Menu>
};

export type BlogError = {
    code: number,
    message: string
};

export type LoginInformation = {
    email: string,
    password: string
};

export type LoginResponse = {
    isAuthenticated: boolean,
    token: string
};

export type BlogAction = {
    type: string,
    payload: any
};