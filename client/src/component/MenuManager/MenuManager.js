import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui-icons/Settings';
import Delete from 'material-ui-icons/Delete';
import TextField from 'material-ui/TextField';
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

const headerNames = [
    'Name', 'URL', 'Parent', 'Delete'
];

class MenuManager extends Component {
    state = {
        editableCellName: '',
        editableRowKey: '',
        isEditable: false
    }

    handleButtonClick = () => {
        const { isDialogOpened, openDialog, closeDialog } = this.props;
        isDialogOpened ? closeDialog() : openDialog();
    }

    handleDialogClose = () => {
        this.props.closeDialog();
    }

    handleCellClick = () => {
        const currentEditable = this.state.isEditable;
        this.setState({
            isEditable: !currentEditable
        });
        console.log('current status - ', this.state.isEditable);
    }

    getEditableOrPlainText = (menu, currentCellIndex) => {
        const { isEditable, editableRowId, editableCellName } = this.props;
        if (isEditable && menu.id === editableRowId && headerNames[currentCellIndex] === editableCellName) {
            return <TextField>{menu.title}</TextField>
        } else {
            return (
                <TableCell onClick={this.handleCellClick}>{Object.keys(menu)}</TableCell>
            )
        }
    }

    render() {
        const { classes, isDialogOpened, isEditable, editableRowId, editableCellName, menus } = this.props;
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
                            <TableHead>
                                <TableRow>
                                    {headerNames.map(name => <TableCell>{this.name}</TableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {menus.map(menu => {
                                    return (
                                        <TableRow key={menu.id}>
                                            <TableCell><TextField value={menu.title}/></TableCell>
                                            <TableCell onClick={this.handleCellClick}>{menu.url}</TableCell>
                                            <TableCell onClick={this.handleCellClick}>-1</TableCell>
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