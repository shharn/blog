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
        { isDialogOpened, isEditable, editableRowId, editableCellIndex } = state.app.ui.menuManager;
    return {
        isEditable,
        editableRowId,
        editableCellIndex,
        isDialogOpened,
        menus: Object.keys(data).map(key => data[key])
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openDialog: () => dispatch(openMenuManagementDialog()),
        closeDialog: () => dispatch(closeMenuManagementDialog()),
        changeEditableCell: (rowId, cellIndex) => dispatch(changeToEditableCell(rowId, cellIndex)),
        disableEditableCell: () => dispatch(disableEditableCell())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuManager);