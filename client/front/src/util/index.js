// @flow
export const formatString = (format: string, ...rest: Array<string>) => {
    let index = 0;
    return format.replace(/%s/g, () => rest[index++]);
}

export const createUnique = (name: string): any /* Symbol */ => {
    if (typeof Symbol === 'function') {
        return Symbol(name);
    }
    return `${Date.now()}: + name`;
};

export function isNetworkOffline(response: any): boolean {
    return !response.status;
}