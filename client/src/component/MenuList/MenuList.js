import React, { Component } from 'react';
import Table, { TableHead, TableRow, TableBody, TableCell } from 'material-ui/Table';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Delete from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import TableCellWrapper from '../TableCellWrapper';
import EditableCell from '../EditableCell';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

const headerNames = [
    'Name', 'URL', 'Parent', 'Delete'
];

class MeuList extends Component {

    handleCellClick = (rowId, cellIndex) => {
        this.props.changeEditableCell(rowId, cellIndex);
    }

    handleEnterKeyUpOnEditableCell = menu => {
        this.props.updateMenu(menu);
    }

    getEditableOrPlainText = (rowId, value, currentCellIndex) => {
        const { editableCellIndex } = this.props;
        if (currentCellIndex === editableCellIndex) {
            return <EditableCell 
                key={`${rowId}:${currentCellIndex}`}
                rowId={rowId} 
                cellIndex={currentCellIndex} 
                value={value}
                 onEnterKeyUp={this.handleEnterKeyUpOnEditableCell}
                 onEscKeyUp={this.props.disableEditableCell}/>
        } else {
            return (
                <TableCellWrapper key={`${rowId}:${currentCellIndex}`} rowId={rowId} cellIndex={currentCellIndex} value={value} onCellClick={this.handleCellClick}/>
            )
        }
    }

    render() {
        const { menus, isEditable, editableRowId, classes } = this.props;
        return (
            <div className={classes.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headerNames.map(name => <TableCell variant='head' key={name}>{name}</TableCell>)}
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
                <Button className={classes.addButton} variant="fab" mini color="secondary" aria-label="add">
                        <AddIcon/>
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(MeuList);