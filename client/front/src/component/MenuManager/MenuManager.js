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
import type { WithStylesProps } from '../../flowtype';
import type { Element } from 'react';

type Props = {
    classes: any,
    isDialogOpened: boolean,
    childComponent: $Values<MenuManagerChildComponentType>,

    disableEditableCell: () => void,
    changeChildComponent: (childComponent: $Values<MenuManagerChildComponentType>) => void,
    closeDialog: () => void,
    openDialog: () => void
};

class MenuManager extends Component<Props & WithStylesProps> {
    handleManagementButtonClick = (): void => {
        const { isDialogOpened, openDialog, closeDialog } = this.props;
        isDialogOpened ? closeDialog() : openDialog();
    }

    handleDialogClose = (e: SyntheticKeyboardEvent<HTMLElement> | { target: HTMLElement }): void => {
        if ((e.type === 'keyup' && e.target.tagName !== "INPUT") || e.type === 'click') {
            this.props.changeChildComponent(MenuManagerChildComponentType.LIST);
            this.props.closeDialog();
        }
    }

    handleEscKeyDown = (e: SyntheticKeyboardEvent<HTMLElement> ): void => {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }

        if (this.isFromInput(e.target)) {
            return;
        }
        this.props.childComponent === MenuManagerChildComponentType.LIST ? 
            this.props.closeDialog() :
            this.props.changeChildComponent(MenuManagerChildComponentType.LIST);
    }

    isFromInput = (target: HTMLElement): boolean => {
        return target.tagName === 'INPUT';
    }

    getRightComponent = (): Element<*> => {
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

    switchToList = (): void => {
        this.props.changeChildComponent(MenuManagerChildComponentType.LIST);
    }

    switchToCreateMenu = (): void => {
        this.props.changeChildComponent(MenuManagerChildComponentType.CREATE_MENU);
    }

    render = () => {
        const { classes, isDialogOpened } = this.props;
        return (
            <div className={classes.container}>
                <Button 
                    classes={{
                        root: classes.button
                    }}
                    aria-label="Management" 
                    onClick={this.handleManagementButtonClick}
                >
                    <Settings/> 
                </Button>
                <Dialog
                    classes={{
                        paper: classes.dialogPaper
                    }}
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