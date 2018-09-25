import reducer from '../createOrEditArticle';
import { UI as UIActionType } from '../../../action/types';

const initialState = {
    isEditMode: false,
    article: null
};

const testMenuData1 = {
    uid: '0x001',
    name: 'test menu',
};

const testMenuData2 = {
    uid: '0x002',
    name: 'test menu 2'
};

const testArticleData1 = {
    uid: '0x0101',
    title: 'test article title',
    content: 'test article content',
    summary: 'test article summary',
    createdAt: '5 May, 2018',
    views: 100,
    menu: testMenuData1
};

const testArticleData2 = {
    uid: '0x0102',
    title: 'test article title 2',
    content: 'test article content 2',
    summary: 'test article summary 2',
    createdAt: '5 May, 2017',
    views: 200,
    menu: testMenuData2
};

describe('app.ui.createOrEditArticle reducer test', () => {
    test('Should return the initial state', () => {
        const actual = reducer(undefined, {});
        const expected = { ...initialState };
        expect(actual).toEqual(expected);
    });

    test('Should include the data', () => {
        const actual = reducer(undefined, {
            type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE,
            payload: {
                isEditMode: true,
                article: {
                    ...testArticleData1
                }
            }
        });
        const expected = {
            ...initialState,
            isEditMode: true,
            article: {
                ...testArticleData1
            }
        };
        expect(actual).toEqual(expected);
    });

    test('Should overwrite existing data', () => {
        const initial = {
            ...initialState,
            isEditMode: true,
            article: { ...testArticleData1 }
        };
        const actual = reducer(initial, {
            type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE,
            payload: {
                isEditMode: true,
                article: { ...testArticleData2 }
            }
        });
        const expected = {
            ...initialState,
            isEditMode: true,
            article: { ...testArticleData2 }
        };
        expect(actual).toEqual(expected);
    });

    test('Should return the initial state when the data is null in action.payload', () => {
        const initial = {
            ...initialState,
            isEditMode: true,
            article: { ...testArticleData1 }
        };
        const actual = reducer(initial, {
            type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_ARTICLE,
            payload: {
                isEditMode: false,
                article: null
            }
        });
        const expected = {
            ...initialState,
            isEditMode: false,
            article: null
        };
        expect(actual).toEqual(expected);
    });
});