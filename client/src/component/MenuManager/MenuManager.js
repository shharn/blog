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

    handleCellClick = (event) => {
        console.dir(event);
        // need to get current row id(menu.id) & current cell index
    }

    getEditableOrPlainText = (value, currentCellIndex) => {
        const { editableCellIndex } = this.props;
        if (currentCellIndex === editableCellIndex) {
            return <TextField>{value}</TextField>
        } else {
            return (
                <TableCell onClick={this.handleCellClick}>{value}</TableCell>
            )
        }
    }

    render() {
        const { classes, isDialogOpened, isEditable, editableRowId, menus } = this.props;
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
                                    {headerNames.map(name => <TableCell key={name}>{name}</TableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {menus.map(menu => {
                                    return (
                                        <TableRow key={menu.id}>
                                            {isEditable === true && menu.id === editableRowId ? 
                                            Object.keys(menu).map((key, index) => this.getEditableOrPlainText(menu[key], index)) :
                                            Object.keys(menu).map(key => <TableCell key={menu[key]} onClick={this.handleCellClick}>{menu[key]}</TableCell>)}
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

{/* <TableCell><TextField value={menu.title}/></TableCell>
                                            <TableCell onClick={this.handleCellClick}>{menu.url}</TableCell>
                                            <TableCell onClick={this.handleCellClick}>-1</TableCell> } */}

export default withStyles(styles)(MenuManager);