import { connect } from 'react-redux';
import MenuManager from './MenuManager';
import { 
    openMenuManagementDialog, 
    closeMenuManagementDialog,
    disableEditableCell
} from '../../action/ui';

const mapStateToProps = (state, ownProps) => {
     const { isDialogOpened, isEditable } = state.app.ui.menuManager;
    return {
        isDialogOpened,
        isEditable
    }
}

const mapDispatchToProps = dispatch => {
    return {
        disableEditableCell: () => dispatch(disableEditableCell()),
        openDialog: () => dispatch(openMenuManagementDialog()),
        closeDialog: () => dispatch(closeMenuManagementDialog()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuManager);