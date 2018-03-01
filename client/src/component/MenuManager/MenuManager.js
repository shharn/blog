import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui-icons/Settings';
import Delete from 'material-ui-icons/Delete';
import Dialog, {
    DialogContent,
} from 'material-ui/Dialog';
import Table, {
    TableBody, 
    TableCell,
    TableHead,
    TableRow 
} from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

class MenuManager extends Component {
    handleButtonClick = () => {
        const { isDialogOpened, openDialog, closeDialog } = this.props;
        isDialogOpened ? closeDialog() : openDialog();
    }

    handleDialogClose = () => {
        this.props.closeDialog();
    }

    render() {
        const { classes, isDialogOpened, menus } = this.props;
        return (
            <div className={classes.container}>
                <IconButton aria-label="Management" onClick={this.handleButtonClick}>
                    <Settings/> 
                </IconButton>
                <Dialog
                    open={isDialogOpened}
                    onClose={this.handleDialogClose}
                    aria-labelledby="dialog-content"
                >
                    <DialogContent id="dialog-content" className={classes.dialogContent}>
                        <Table>
                            <TableHead className={classes.tableHead}>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>URL</TableCell>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>&nbsp;</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.tableBody}>
                                {menus.map(menu => {
                                    return (
                                        <TableRow key={menu.Title}>
                                            <TableCell>{menu.Title}</TableCell>
                                            <TableCell>{menu.Url}</TableCell>
                                            <TableCell>-1</TableCell>
                                            <TableCell>
                                                <IconButton aria-label="Delete">
                                                    <Delete/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(MenuManager);