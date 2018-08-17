// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Settings from '@material-ui/icons/Settings';
import { withStyles } from '@material-ui/core/styles';
import CreateOrEditMenu from '../CreateOrEditMenu';
import ResponsiveMenuList from '../ResponsiveMenuList';
import { MenuManagerChildComponentType } from '../../constant';
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

    handleEscKeyDown = (e) => {
        this.props.childComponent === MenuManagerChildComponentType.LIST ? this.props.closeDialog() :
            this.props.changeChildComponent(MenuManagerChildComponentType.LIST);
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
                <Button aria-label="Management" onClick={this.handleManagementButtonClick}>
                    <Settings/> 
                </Button>
                <Dialog
                    open={isDialogOpened}
                    onClose={this.handleDialogClose}
                    onEscapeKeyDown={this.handleEscKeyDown}
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