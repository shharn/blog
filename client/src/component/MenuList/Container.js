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
    mutationOperationType
} from '../../constant';

const MENU_DATA_NAME = 'menus';

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.get.menus,
        { isEditable, editableRowId, editableCellIndex } = state.app.ui.menuManager;
    return {
        isEditable,
        editableRowId,
        editableCellIndex,
        menus: Object.keys(data).map(key => data[key])
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeEditableCell: (rowId, cellIndex) => dispatch(changeToEditableCell(rowId, cellIndex)),
        disableEditableCell: () => dispatch(disableEditableCell()),
        updateMenu: menu => dispatch(requestDataMutation(mutationOperationType.UPDATE, menu, MENU_DATA_NAME)),
        deleteMenu: id => dispatch(requestDataMutation(mutationOperationType.DELETEid, MENU_DATA_NAME)),
        createMenu: menu => dispatch(requestDataMutation(mutationOperationType.CREATE, menu, MENU_DATA_NAME))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);