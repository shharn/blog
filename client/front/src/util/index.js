export const formatString = (format, ...rest) => {
    let index = 0;
    return format.replace(/%s/g, () => rest[index++]);
}

export const createUnique = name => {
    if (typeof Symbol === 'function') {
        return Symbol(name);
    }
    return name;
};