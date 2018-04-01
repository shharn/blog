import { connect } from 'react-redux';
import MenuList from './MenuList';
import { 
    changeToEditableCell,
    disableEditableCell
} from '../../action/ui';
import { 
    requestDataMutation
} from '../../action/data';
import {
    MutationOperationType,
    Token
} from '../../constant';
import LocalStorage from 'local-storage'

import type { Menu } from '../../flowtype'

const MENU_DATA_NAME = 'menus';

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.get.menus,
        { isEditable, editableRowId, editableCellName } = state.app.ui.menuManager;
    return {
        isEditable,
        editableRowId,
        editableCellName,
        menus: Object.keys(data).map(key => data[key]),
        ...ownProps
    }
}

const mapDispatchToProps = dispatch => {
    const clientToken = LocalStorage.get(Token.key)
    return {
        changeEditableCell: (rowId: number, cellName: string) => dispatch(changeToEditableCell(rowId, cellName)),
        disableEditableCell: () => dispatch(disableEditableCell()),
        updateMenu: (menu: Menu) => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, MENU_DATA_NAME, clientToken)),
        deleteMenu: (id: number) => dispatch(requestDataMutation(MutationOperationType.DELETE, id, MENU_DATA_NAME, clientToken))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);