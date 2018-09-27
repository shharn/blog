import reducer from '../menuManager';
import { UI as UIActionType } from '../../../action/types';
import { MenuManagerChildComponentType } from '../../../constant';
import MenuManager from '../../../component/MenuManager/MenuManager';

const initialState = {
    isDialogOpened: false,
    childComponent: MenuManagerChildComponentType.LIST
};

describe('app.ui.menuManager reducer test', () => {
    test('Should return the initial state', () => {
        const actual = reducer(undefined, {});
        expect(actual).toEqual(initialState);
    });

    describe('Should handle OPEN_MENU_MANAGEMENT_DIALOG', () => {
        test('isDialogOpened: false -> isDialogOpened: true', () => {
            const actual = reducer(undefined, {
                type: UIActionType.OPEN_MENU_MANAGEMENT_DIALOG
            });
            const expected = {
                ...initialState,
                isDialogOpened: true
            };
            expect(actual).toEqual(expected);
        });

        test('isDialogOpened: true -> isDialogOpened: true', () => {
            const initial = {
                ...initialState,
                isDialogOpened: true
            };
            const actual = reducer(initial, {
                type: UIActionType.OPEN_MENU_MANAGEMENT_DIALOG
            });
            const expected = {
                ...initialState,
                isDialogOpened: true
            };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle CLOSE_MENU_MANAGEMENT_DIALOG', () => {
        test('isDialogOpened: true -> isDialogOpened: false', () => {
            const initial = {
                ...initialState,
                isDialogOpened: true
            };
            const actual = reducer(initial, {
                type: UIActionType.CLOSE_MENU_MANAGEMENT_DIALOG
            });
            const expected = {
                ...initialState,
                isDialogOpened: false
            };
            expect(actual).toEqual(expected);
        });
        
        test('isDialogOpened: false -> isDialogOpened: false', () => {
            const actual = reducer(undefined, {
                type: UIActionType.CLOSE_MENU_MANAGEMENT_DIALOG
            });
            const expected = { ...initialState };
            expect(actual).toEqual(expected);
        });
    });

    describe('Should handle SWITCH_MENU_MANAGER_CHILD_COMPONENT', () => {
        test('LIST -> CREATE_MENU', () => {
            const actual = reducer(undefined, {
                type: UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT,
                payload: {
                    childComponent: MenuManagerChildComponentType.CREATE_MENU   
                }
            });
            const expected = {
                ...initialState,
                childComponent: MenuManagerChildComponentType.CREATE_MENU
            };
            expect(actual).toEqual(expected);
        });
         
        test('LIST -> EDIT_MENU', () => {
            const initial = {
                ...initialState,
                isDialogOpened: true,
            };
            const actual =reducer(initial, {
                type: UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT,
                payload: {
                    childComponent: MenuManagerChildComponentType.EDIT_MENU
                }
            });
            const expected = {
                ...initial,
                childComponent: MenuManagerChildComponentType.EDIT_MENU
            };
            expect(actual).toEqual(expected);
         });
        
         test('CREATE_MENU -> LIST', () => {
            const initial = {
                ...initialState,
                childComponent: MenuManagerChildComponentType.CREATE_MENU
            };
            const actual = reducer(initial, {
                type: UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT,
                payload: {
                    childComponent: MenuManagerChildComponentType.LIST
                }
            });
            const expected = {
                ...initial,
                childComponent: MenuManagerChildComponentType.LIST
            };
            expect(actual).toEqual(expected);
         });
        
         test('EDIT_MENU -> LIST', () => {
            const initial = {
                ...initialState,
                childComponent: MenuManagerChildComponentType.EDIT_MENU
            };
            const actual = reducer(initial, {
                type: UIActionType.SWITCH_MENU_MANAGER_CHILD_COMPONENT,
                payload: {
                    childComponent: MenuManagerChildComponentType.LIST
                }
            });
            const expected = {
                ...initial,
                childComponent: MenuManagerChildComponentType.LIST
            };
            expect(actual).toEqual(expected);
         });
    });
});