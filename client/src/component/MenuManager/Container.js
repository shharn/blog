import { connect } from 'react-redux';
import MenuManager from './MenuManager';
import { 
    openMenuManagementDialog, 
    closeMenuManagementDialog,
    disableEditableCell,
    switchMenuManagerChildComponent
} from '../../action/ui';
import { MenueManagerChildComponentType } from '../../constant';

const mapStateToProps = (state, ownProps) => {
     const { isDialogOpened, childComponent } = state.app.ui.menuManager;
    return {
        isDialogOpened,
        childComponent
    }
}

const mapDispatchToProps = dispatch => {
    return {
        disableEditableCell: () => dispatch(disableEditableCell()),
        openDialog: () => dispatch(openMenuManagementDialog()),
        closeDialog: () => dispatch(closeMenuManagementDialog()),
        changeChildComponent: (childComponent: $Values<MenueManagerChildComponentType>) => dispatch(switchMenuManagerChildComponent(childComponent))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuManager);