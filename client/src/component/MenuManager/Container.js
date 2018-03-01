import { connect } from 'react-redux';
import MenuManager from './MenuManager';
import { openMenuManagementDialog, closeMenuManagementDialog } from '../../action/ui';

const mapStateToProps = (state, ownProps) => {
    return {
        isDialogOpened: state.app.ui.menuManager.isDialogOpened,
        menus: state.app.data.menus.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openDialog: () => dispatch(openMenuManagementDialog()),
        closeDialog: () => dispatch(closeMenuManagementDialog())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuManager);