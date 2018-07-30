export const formatString = (format, ...rest) => {
    let index = 0;
    return format.replace(/%s/g, () => rest[index++]);
}