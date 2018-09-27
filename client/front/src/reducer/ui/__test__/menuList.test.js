import reducer from '../menuList';
import { UI as UIActionType } from '../../../action/types';

const initialState = {
    isEditable: false,
    editableRowId: null,
    editableCellName: null
};

describe('app.ui.menuList reducer test', () => {
    test('Should return the initial state', () => {
        const actual = reducer(undefined, {});
        const expected = { ...initialState };
        expect(actual).toEqual(expected);
    });

    describe('Should handle CHANGE_EDITABLE_CELL', () => {
        test('not editable -> editable', () => {
            const initial = { ...initialState };
            const rowId = '0x001';
            const cellName = 'title';
            const actual = reducer(initial, {
                type: UIActionType.CHANGE_EDITABLE_CELL,
                payload: {
                    rowId, 
                    cellName
                }
            });
            const expected = {
                isEditable: true,
                editableRowId: rowId,
                editableCellName: cellName
            };
            expect(actual).toEqual(expected);
        });

        test('editable -> another editable', () => {
            const rowId1 = '0x001';
            const rowId2 = '0x002';
            const cellName1 = 'title';
            const cellName2 = 'url';
            const initial = { 
                ...initialState,
                isEditable: true,
                editableRowId: rowId1,
                editableCellName: cellName1
            };
            const actual = reducer(initial, {
                type: UIActionType.CHANGE_EDITABLE_CELL,
                payload: {
                    rowId: rowId2,
                    cellName: cellName2
                }
            });
            const expected = {
                ...initialState,
                isEditable: true,
                editableRowId: rowId2,
                editableCellName: cellName2
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle DISABLE_EDITABLE_CELL', () => {
        test('not editable -> not editable', () => {
            const actual = reducer({}, {
                type: UIActionType.DISABLE_EDITABLE_CELL
            });
            const expected = {
                isEditable: false,
                editableRowId: null,
                editableCellName: null
            };
            expect(actual).toEqual(expected);
        });

        test('ediable -> not editable', () => {
            const initial = {
                isEditable: true,
                editableRowId: '0x001',
                editableCellName: 'title'
            };
            const actual = reducer(initial, {
                type: UIActionType.DISABLE_EDITABLE_CELL
            });
            const expected = {
                isEditable: false,
                editableRowId: null,
                editableCellName: null
            };
            expect(actual).toEqual(expected);
        });
    })
});