const NAME_SEPERATOR = '-';
const WHITE_SPACE = ' ';
export const nameToUID = (name, data, propName) => {
    // 'name' is always lowercase
    let splitted = name.split(NAME_SEPERATOR);
    let result = data.filter(datum => {
        let splitted2 = datum[propName].split(WHITE_SPACE);
        if (splitted.length !== splitted2.length) return false;
        for (let i = 0; i < splitted.length; i++) {
            if (splitted[i] !== splitted2[i].toLowerCase()) return false;
        }
        return true;
    });
    return result ? result.uid : null
};
