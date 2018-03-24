import React, { Component } from 'react';
import EditableCell from '../EditableCell'
import SelectCell from '../MenuManagerSelectCell'
import TableCellWrapper from '../TableCellWrapper'

import type { Menu } from '../../flowtype'

type Props = {
    isEditable: boolean,
    cellName: string,
    menu: Menu,

    changeEditableCell: (rowId: number, cellName: string) => void,
    disableEditableCell: () => void,
    updateMenu: (menu: Menu) => void
}

class MenuManagerTableCell extends Component {
    handleCellClick = () => {
        const { menu, cellName } = this.props
        this.props.changeEditableCell(menu.id, cellName)
    }

    handleEnterKeyUpOnEditableCell = (cellName: string, value: string) => {
        const maybeCloned = { ...this.props.menu,  [cellName]: value }
        this.props.updateMenu(maybeCloned)
    }

    handleEscKeyUpOnEditableCell = () => {
        this.props.disableEditableCell()
    }

    getEditableOrPlainText = () => {
        const { isEditable, cellName, menu } = this.props
        if (isEditable) {
            return (
                <EditableCell
                    rowId={menu.id} 
                    cellName={cellName}
                    value={menu[cellName]}
                    onEnterKeyUp={this.handleEnterKeyUpOnEditableCell}
                    onEscKeyUp={this.handleEscKeyUpOnEditableCell}/>
            )
        } else {
            return (
                <TableCellWrapper 
                    rowId={menu.id} 
                    cellName={cellName} 
                    value={menu[cellName]} 
                    onCellClick={this.handleCellClick}/>
            )
        }
    }

    render() {
        const { cellName, menu } = this.props
        return (
            cellName === 'parentId' ?  <SelectCell menu={menu}/> : this.getEditableOrPlainText()
        )
    }   
}

export default MenuManagerTableCell;