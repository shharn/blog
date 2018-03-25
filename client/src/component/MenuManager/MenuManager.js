import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui-icons/Settings';
import CreateMenu from '../CreateMenu';
import Dialog, {
    DialogContent,
} from 'material-ui/Dialog';
import ResponsiveMenuList from '../ResponsiveMenuList';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

const componentToDisplay = {
    LIST: 'LIST',
    CREATE_MENU: 'CREATE_MENU'
}

class MenuManager extends Component {
    state = {
        showWhich: componentToDisplay.LIST
    }

    toggleComponent = () => {
        const { showWhich } = this.state;
        this.setState({
            showWhich: showWhich === componentToDisplay.LIST ? 
            componentToDisplay.CREATE_MENU : 
            componentToDisplay.LIST
        });
    }

    handleManagementButtonClick = () => {
        const { isDialogOpened, openDialog, closeDialog } = this.props;
        isDialogOpened ? closeDialog() : openDialog();
    }

    handleDialogClose = (event) => {
        if ((event.type === 'keydown' && event.target.tagName !== "INPUT") || event.type === 'click') {
            this.props.closeDialog();
            this.setState({ showWhich: componentToDisplay.LIST })
        }
    }

    handleEmptySpaceClick = (event) => {
        (this.props.isEditable && !this.isFromEditableCell(event)) && this.props.disableEditableCell();
    }

    isFromEditableCell = (event) => {
        let target = event.target;
        return target.tagName === 'TD' && target.children.length < 1;
    }

    getRightComponent = () => {
        const whichComponent = this.state.showWhich;
        switch(whichComponent) {
            case componentToDisplay.LIST:
                return <ResponsiveMenuList toggleComponent={this.toggleComponent}/>;
            case componentToDisplay.CREATE_MENU:
                return <CreateMenu toggleComponent={this.toggleComponent}/>;
            default:
               return <ResponsiveMenuList toggleComponent={this.toggleComponent}/>;
        }
    }

    render() {
        const { classes, isDialogOpened } = this.props;
        console.log('MenuManager was rendered')
        return (
            <div className={classes.container}>
                <IconButton aria-label="Management" onClick={this.handleManagementButtonClick}>
                    <Settings/> 
                </IconButton>
                <Dialog
                    open={isDialogOpened}
                    onClose={this.handleDialogClose}
                    onEscapeKeyDown={this.handleKeyDownOnDialog}
                    onClick={this.handleEmptySpaceClick}
                    aria-labelledby="dialog-content"
                >
                    <DialogContent id="dialog-content" className={classes.dialogContent}>
                        {this.getRightComponent()}
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(MenuManager);