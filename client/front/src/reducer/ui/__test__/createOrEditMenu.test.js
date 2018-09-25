import reducer from '../createOrEditMenu';
import { UI as UIActionType } from '../../../action/types';

const initialState = {
    isEditMode: false,
    menu: null
};

const testMenuData1 = {
    uid: '0x001',
    name: 'test menu',
};

const testMenuData2 = {
    uid: '0x002',
    name: 'test menu 2'
};

describe('app.ui.createOrEditMenu reducer test', () => {
    test('Should return the initial state', () => {
        const actual = reducer(undefined, {});
        const expected = { ...initialState };
        expect(actual).toEqual(expected);
    });

    test('Should include the data', () =>{
        const actual = reducer(undefined, {
            type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_MENU,
            payload: {
                isEditMode: true,
                menu: { ...testMenuData1 }
            }
        });
        const expected = {
            ...initialState,
            isEditMode: true,
            menu: { ...testMenuData1 }
        };
        expect(actual).toEqual(expected);
    });

    test('Should overwrite existing data', () => {
        const initial = {
            ...initialState,
            menu: { ...testMenuData1 },
            isEditMode: true
        };
        const actual = reducer(initial, {
            type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_MENU,
            payload: {
                isEditMode: true,
                menu: { ...testMenuData2 }
            }
        });
        const expected = {
            ...initialState,
            isEditMode: true,
            menu: { ...testMenuData2 }
        };
        expect(actual).toEqual(expected);
    });

    test('Should be initialized to null data', () => {
        const initial = {
            ...initialState,
            menu: { ...testMenuData1 },
            isEditMode: true
        };
        const actual = reducer(initial, {
            type: UIActionType.SET_DATA_FOR_CREATE_OR_EDIT_MENU,
            payload: {
                isEditMode: false,
                menu: null
            }
        });
        const expected = {
            ...initialState,
            isEditMode: false,
            menu: null
        };
        expect(actual).toEqual(expected);
    });
});