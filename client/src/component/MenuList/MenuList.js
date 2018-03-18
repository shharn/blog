import React, { Component } from 'react';
import Table, { TableHead, TableRow, TableBody, TableCell } from 'material-ui/Table';
import ButtonWrapper from '../ButtonWrapper'
import TableCellWrapper from '../TableCellWrapper';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import EditableCell from '../EditableCell';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

import type { Menu } from '../../flowtype'

const headerNames = [
    'Name', 'URL', 'Parent', 'Delete'
];

type Props = {
    isEditable: boolean,
    editableRowId: number,
    editableCellIndex: number,
    menus: Array<Menu>,

    changeEditableCell: (rowId: number, cellIndex: number) => void,
    disableEditableCell: () => void,
    updateMenu: (menu: Menu) => void,
    deleteMenu: (id: number) => void,
    createMenu: (menu: Menu) => void,
    toggleComponent: () => void
}

type State = {

}

class MeuList extends Component<Props, State> {
    handleCellClick = (rowId: number, cellIndex: number) => {
        this.props.changeEditableCell(rowId, cellIndex);
    }

    handleEnterKeyUpOnEditableCell = (menu: Menu) => {
        this.props.updateMenu(menu);
    }

    getEditableOrPlainText = (rowId: number, value: number | string, currentCellIndex: number) => {
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

    deleteMenu = (id: number) => {
        this.props.deleteMenu(id)
    }

    render() {
        const { menus, isEditable, editableRowId, toggleComponent, classes } = this.props;
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
                                        <ButtonWrapper deleteMenu={this.deleteMenu} id={menu.id}/>
                                    </TableCell>
                                </TableRow>
                                )
                        })}
                    </TableBody>
                </Table>
                <Button className={classes.addButton} variant="fab" mini color="secondary" aria-label="add" onClick={toggleComponent}>
                    <AddIcon/>
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(MeuList);