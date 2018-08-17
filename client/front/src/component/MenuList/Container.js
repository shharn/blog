import { connect } from 'react-redux';
import MenuList from './MenuList';
import { 
    changeToEditableCell,
    disableEditableCell,
} from '../../action/ui';
import { 
    requestDataMutation
} from '../../action/data';
import {
    MutationOperationType,
    Token
} from '../../constant';
import LocalStorage from 'local-storage';

import type { Menu } from '../../flowtype';

const MENU_DATA_NAME = 'menus';

const mapStateToProps = (state, ownProps) => {
    const menus =  [ ...state.app.data.get.menus.data ];
    const { isEditable, editableRowId, editableCellName } = state.app.ui.menuManager;
    return {
        isEditable,
        editableRowId,
        editableCellName,
        menus,
        ...ownProps
    };
};

const mapDispatchToProps = dispatch => {
    const clientToken = LocalStorage.get(Token.key);
    return {
        changeEditableCell: (rowId: number, cellName: string) => dispatch(changeToEditableCell(rowId, cellName)),
        disableEditableCell: () => dispatch(disableEditableCell()),
        updateMenu: (menu: Menu) => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, MENU_DATA_NAME, clientToken)),
        deleteMenu: (uid: number) => dispatch(requestDataMutation(MutationOperationType.DELETE, uid, MENU_DATA_NAME, clientToken)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);