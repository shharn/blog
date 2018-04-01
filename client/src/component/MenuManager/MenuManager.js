import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui-icons/Settings';
import CreateOrEditMenu from '../CreateOrEditMenu';
import Dialog, {
    DialogContent,
} from 'material-ui/Dialog';
import ResponsiveMenuList from '../ResponsiveMenuList';
import { MenuManagerChildComponentType } from '../../constant'
import { withStyles } from 'material-ui/styles';
import styles from './styles';

import type { Menu } from '../../flowtype'

class MenuManager extends Component {
    handleManagementButtonClick = () => {
        const { isDialogOpened, openDialog, closeDialog } = this.props;
        isDialogOpened ? closeDialog() : openDialog();
    }

    handleDialogClose = (event) => {
        if ((event.type === 'keydown' && event.target.tagName !== "INPUT") || event.type === 'click') {
            this.props.closeDialog();
            this.setState({ showWhich: MenuManagerChildComponentType.LIST })
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
            case MenuManagerChildComponentType.LIST:
                return <ResponsiveMenuList toggleComponent={this.toggleComponent}/>
            case MenuManagerChildComponentType.CREATE_MENU:
                return <CreateOrEditMenu toggleComponent={this.toggleComponent} isEditMode={false}/>
            case MenuManagerChildComponentType.UPDATE_MENU:
                return <CreateOrEditMenu isEditMode={true} menu={this.props.menu}/>
            default:
               return <ResponsiveMenuList toggleComponent={this.toggleComponent}/>
        }
    }

    render() {
        const { classes, isDialogOpened } = this.props;
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