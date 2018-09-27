import { 
    formatString,
    createUnique,
    isNetworkOffline
} from '../'

describe('formatString test', () => {
    test('no format string', () => {
        const actual = formatString('no format string');
        expect(actual).toMatch('no format string');
    });

    test('no format string with arguments', () => {
        const actual = formatString('no format string', 1, 'arg2');
        expect(actual).toMatch('no format string');
    });
});

describe('createUnique test', () => {
    test('Should return unique value when the two input are different', () => {
        const name1 = 'testname1';
        const name2 = 'testname2';
        const result1 = createUnique(name1);
        const result2 = createUnique(name2);
        expect(result1).not.toBe(result2);
    });
    
    test('Should return unique value even if the input is the same', () => {
        const name = 'testname';
        const result1 = createUnique(name);
        const result2 = createUnique(name);
        expect(result1).not.toBe(result2);
    });
});

describe('isNetworkOffline test', () => {
    test('online', () => {
        const response = new Response('test response', { status: 500 });
        expect(isNetworkOffline(response)).toBe(false);
    });

    test('offline', () => {
        const response = new Response('test response', { status: undefined });
        expect(isNetworkOffline(response)).toBe(true);
    });
});