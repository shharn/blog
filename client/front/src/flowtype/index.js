export type Menu = {
    uid?: string,
    name: string,
    url?: string,
    parent?: Array<Menu>,
    children?: Array<Menu>
};

export type Article = {
    uid?: string,
    title: string,
    content: string,
    summary: string,
    createdAt: string,
    views: number,
    menu: ?Menu
}

export type LoginInformation = {
    email: string,
    password: string
};

export type LoginResponse = {
    isValid: boolean,
    token: string
};

export type ClientError = {
    code: number,
    message: string
};

export type WithStylesProps = {
    classes: any,
    theme?: any
};

export type RouterProps = {
    history: any,
    location: any, 
    match: any
};