import { connect } from 'react-redux';
import MenuManager from './MenuManager';
import { 
    openMenuManagementDialog, 
    closeMenuManagementDialog,
    changeToEditableCell,
    disableEditableCell
} from '../../action/ui';

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.menus,
        { isDialogOpened, isEditable, editableRowId, editableCellName } = state.app.ui.menuManager;
    return {
        isEditable,
        editableRowId,
        editableCellName,
        isDialogOpened,
        menus: Object.keys(data).map(key => data[key])
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openDialog: () => dispatch(openMenuManagementDialog()),
        closeDialog: () => dispatch(closeMenuManagementDialog()),
        changeEditableCell: (rowId, cellName) => dispatch(changeToEditableCell(rowId, cellName)),
        disableEditableCell: () => dispatch(disableEditableCell())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuManager);