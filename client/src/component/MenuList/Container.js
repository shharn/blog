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
    mutationOperationType,
    token
} from '../../constant';
import LocalStorage from 'local-storage'

const MENU_DATA_NAME = 'menus';

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.get.menus,
        { isEditable, editableRowId, editableCellIndex } = state.app.ui.menuManager;
    return {
        isEditable,
        editableRowId,
        editableCellIndex,
        menus: Object.keys(data).map(key => data[key]),
        ...ownProps
    }
}

const mapDispatchToProps = dispatch => {
    const clientToken = LocalStorage.get(token.key)
    console.log(clientToken)
    return {
        changeEditableCell: (rowId, cellIndex) => dispatch(changeToEditableCell(rowId, cellIndex)),
        disableEditableCell: () => dispatch(disableEditableCell()),
        updateMenu: menu => dispatch(requestDataMutation(mutationOperationType.UPDATE, menu, MENU_DATA_NAME, clientToken)),
        deleteMenu: id => dispatch(requestDataMutation(mutationOperationType.DELETE, id, MENU_DATA_NAME, clientToken)),
        createMenu: menu => dispatch(requestDataMutation(mutationOperationType.CREATE, menu, MENU_DATA_NAME, clientToken))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);