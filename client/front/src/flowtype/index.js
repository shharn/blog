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
    menu: ?Menu,
    views: number
}

export type LoginInformation = {
    email: string,
    password: string
};

export type LoginResponse = {
    isValid: boolean,
    token: string,
    platform: string,
    admin: boolean
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

export type State = {
    app: AppState,
    router: any
};

export type Dispatch = (action: Action) => any;

export type GetState = () => State;

