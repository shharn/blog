// @flow
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
    classes: any,

    isEditable: boolean,
    editableRowId: number,
    editableCellName: string,
    menus: Array<Menu>,

    changeEditableCell: (rowId: number, cellName: string) => void,
    disableEditableCell: () => void,
    updateMenu: (menu: Menu) => void,
    deleteMenu: (id: number) => void,
    createMenu: (menu: Menu) => void,
    toggleComponent: () => void
}

class MeuList extends Component<Props> {
    handleCellClick = (rowId: number, cellName: string) => {
        this.props.changeEditableCell(rowId, cellName)
    }

    handleEnterKeyUpOnEditableCell = (rowId: number, cellName: string, value: number | string) => {
        let maybeCloned = this.props.menus.filter(menu => menu.id === rowId)
        if (maybeCloned && maybeCloned.length === 1) {
            maybeCloned[0][cellName] = value
            this.props.updateMenu(maybeCloned[0])
        }
    }

    getEditableOrPlainText = (rowId: number, currentCellName: string, value: number | string) => {
        const { editableCellName } = this.props;
        if (currentCellName === editableCellName) {
            return <EditableCell 
                key={`${currentCellName}:${rowId}`}
                rowId={rowId} 
                cellName={currentCellName}
                value={value}
                onEnterKeyUp={this.handleEnterKeyUpOnEditableCell}
                onEscKeyUp={this.props.disableEditableCell}/>
        } else {
            return (
                <TableCellWrapper key={`${currentCellName}:${rowId}`} rowId={rowId} cellName={currentCellName} value={value} onCellClick={this.handleCellClick}/>
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
                                    Object.keys(menu).map(key => key !== 'id' && this.getEditableOrPlainText(menu.id, key, menu[key])) :
                                    Object.keys(menu).map(key => key !== 'id' && <TableCellWrapper key={`:${key}:${menu[key]}`} rowId={menu.id} cellName={key} value={menu[key]} onCellClick={this.handleCellClick}/>)}
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