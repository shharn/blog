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
    state = {
        editableCellName: '',
        editableRowKey: '',
        isEditable: false
    }

    constructor() {
        super();
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.getEditableOrPlainText = this.getEditableOrPlainText.bind(this);
        this.handleKeyUpOnEditableCell = this.handleKeyUpOnEditableCell.bind(this);
    }

    handleButtonClick = () => {
        const { isDialogOpened, openDialog, closeDialog } = this.props;
        isDialogOpened ? closeDialog() : openDialog();
    }

    handleDialogClose = () => {
        this.props.closeDialog();
    }

    handleCellClick = (rowId, cellIndex) => {
        this.props.changeEditableCell(rowId, cellIndex);
    }

    handleKeyUpOnEditableCell = (event) => {
        event.stopPropagation();
        console.log('cell handler');
        console.dir(event.target);
        switch(event.keycode) {
            case keycode['enter']:
            case keycode['esc']:
                this.props.disableEditableCell();
                break;
            default:
                break;
        }
    }

    handleKeyDownOnDialog = (event) => {
        console.log('dialog handler');
        console.dir(event.target);
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
                    onKeyDown={this.handleKeyDownOnDialog}
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