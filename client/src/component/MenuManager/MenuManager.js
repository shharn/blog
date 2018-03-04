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
import TableCellWrapper from '../TableCellWrapper';
import keycode from 'keycode';
import styles from './styles';

const headerNames = [
    'Name', 'URL', 'Parent', 'Delete'
];

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

    handleCellClick = (rowId, cellIndex) => {
        this.props.changeEditableCell(rowId, cellIndex);
    }

    handleKeyUpOnEditableCell = (event) => {
        event.stopPropagation();
        switch(event.keycode) {
            case keycode['enter']:
            case keycode['esc']:
                this.props.disableEditableCell();
                break;
            default:
                break;
        }
    }

    handleEmptySpaceClick = (event) => {
        (this.props.isEditable && !this.isFromEditableCell(event)) && this.props.disableEditableCell();
    }

    isFromEditableCell = (event) => {
        let target = event.target;
        return target.tagName === 'TD' && target.children.length < 1;
    }

    getEditableOrPlainText = (rowId, value, currentCellIndex) => {
        const { editableCellIndex } = this.props;
        if (currentCellIndex === editableCellIndex) {
        return <TableCell key={`${rowId}:${currentCellIndex}`}><TextField autoFocus={true} required value={value} onKeyUp={this.handleKeyUpOnEditableCell}/></TableCell>
        } else {
            return (
                <TableCellWrapper key={`${rowId}:${currentCellIndex}`} rowId={rowId} cellIndex={currentCellIndex} value={value} onCellClick={this.handleCellClick}/>
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
                    onEscapeKeyDown={this.handleKeyDownOnDialog}
                    onClick={this.handleEmptySpaceClick}
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
                                            Object.keys(menu).map((key, index) => key !== 'id' && this.getEditableOrPlainText(menu.id, menu[key], index)) :
                                            Object.keys(menu).map((key, index) => key !== 'id' && <TableCellWrapper key={`${menu[key]}:${index}`} rowId={menu.id} cellIndex={index} value={menu[key]} onCellClick={this.handleCellClick}/>)}
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