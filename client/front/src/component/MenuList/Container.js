// @flow
import { connect } from 'react-redux';
import MenuList from './MenuList';
import { changeToEditableCell } from '../../action/ui';
import { requestDataMutation } from '../../action/data';
import { MutationOperationType } from '../../constant';
import type { Menu } from '../../flowtype';
import type { StoreState } from '../../';
import type { Dispatch } from '../../action/types';

const MENU_DATA_NAME = 'menus';

const mapStateToProps = (state: StoreState, ownProps: { switchToList: () => void, switchToCreateMenu: () => void }): Object => {
    const menus =  [ ...state.app.data.get.menus.data ];
    const { isEditable, editableRowId, editableCellName } = state.app.ui.menuList;
    return {
        isEditable,
        editableRowId,
        editableCellName,
        menus,
        updateMutationStatus: state.app.data.mutation.menus.update,
        deleteMutationStatus: state.app.data.mutation.menus.delete,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => {
    return {
        changeEditableCell: (rowId: number, cellName: string) => dispatch(changeToEditableCell(rowId, cellName)),
        updateMenu: (menu: Menu) => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, MENU_DATA_NAME)),
        deleteMenu: (uid: number) => dispatch(requestDataMutation(MutationOperationType.DELETE, uid, MENU_DATA_NAME)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);