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

export function curry(fn: Function): Function {
    const arity = arguments.length;
    return (function resolver(){
        let memory = Array.prototype.slice.call(arguments);
        return function() {
            let local = memory.slice();
            local.push(arguments);
            let next = local.length >= arity ? fn : resolver;
            return next.apply(null, local);
        }
    })();
}