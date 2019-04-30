class LocalStorageMock {
    constructor(jest) {
        Object.defineProperty(this, 'getItem', {
            enumerable: false,
            value: jest.fn(key => this[key] || null),
        });
        Object.defineProperty(this, 'setItem', {
            enumerable: false,
            value: jest.fn((key, val = '') => {
                this[key] = val + '';
            })
        });
        Object.defineProperty(this, 'removeItem', {
            enumerable: false,
            value: jest.fn(key => {
                delete this[key];
            })
        });
        Object.defineProperty(this, 'clear', {
            enumerable: false,
            value: jest.fn(() => {
                Object.keys(this).map(key => delete this[key]);
            })
        });
    }
}

global.localStorage = new LocalStorageMock(jest)