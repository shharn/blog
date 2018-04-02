// @flow
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui-icons/Settings';
import CreateOrEditMenu from '../CreateOrEditMenu';
import Dialog, {
    DialogContent,
} from 'material-ui/Dialog';
import ResponsiveMenuList from '../ResponsiveMenuList';
import { MenuManagerChildComponentType } from '../../constant';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

type Props = {
    classes: any,
    isDialogOpened: boolean,
    childComponent: $Values<MenuManagerChildComponentType>,

    changeChildComponent: (childComponent: $Values<MenuManagerChildComponentType>) => void,
    closeDialog: () => void,
    openDialog: () => void
};

class MenuManager extends Component<Props> {
    handleManagementButtonClick = () => {
        const { isDialogOpened, openDialog, closeDialog } = this.props;
        isDialogOpened ? closeDialog() : openDialog();
    }

    handleDialogClose = (event) => {
        if ((event.type === 'keyup' && event.target.tagName !== "INPUT") || event.type === 'click') {
            this.props.changeChildComponent(MenuManagerChildComponentType.LIST);
            this.props.closeDialog();
        }
    }

    handleKeyDownOnDialog = (e) => {
        this.props.closeDialog();
    }

    isFromEditableCell = (event) => {
        let target = event.target;
        return target.tagName === 'TD' && target.children.length < 1;
    }

    getRightComponent = () => {
        const childComponent = this.props.childComponent;
        switch(childComponent) {
            case MenuManagerChildComponentType.LIST:
                return <ResponsiveMenuList switchToList={this.switchToList} switchToCreateMenu={this.switchToCreateMenu}/>;
            case MenuManagerChildComponentType.CREATE_MENU:
            case MenuManagerChildComponentType.EDIT_MENU:
                return <CreateOrEditMenu switchToList={this.switchToList}/>;
            default:
               return <ResponsiveMenuList switchToList={this.switchToList} switchToCreateMenu={this.switchToCreateMenu}/>
        }
    }

    switchToList = () => {
        this.props.changeChildComponent(MenuManagerChildComponentType.LIST);
    }

    switchToCreateMenu = () => {
        this.props.changeChildComponent(MenuManagerChildComponentType.CREATE_MENU);
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