import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui-icons/Settings';
import Dialog, {
    DialogContent,
} from 'material-ui/Dialog';
import MenuList from '../MenuList';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

class MenuManager extends Component {

    handleButtonClick = () => {
        const { isDialogOpened, openDialog, closeDialog } = this.props;
        isDialogOpened ? closeDialog() : openDialog();
    }

    handleDialogClose = (event) => {
        if (event.srcElement.nodeName !== "INPUT") {
            this.props.closeDialog();
        }
    }

    handleEmptySpaceClick = (event) => {
        (this.props.isEditable && !this.isFromEditableCell(event)) && this.props.disableEditableCell();
    }

    isFromEditableCell = (event) => {
        let target = event.target;
        return target.tagName === 'TD' && target.children.length < 1;
    }

    render() {
        const { classes, isDialogOpened } = this.props;
        return (
            <div className={classes.container}>
                <IconButton aria-label="Management" onClick={this.handleButtonClick}>
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
                        <MenuList/>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(MenuManager);