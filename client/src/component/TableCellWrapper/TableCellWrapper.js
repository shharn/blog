import React, { Component } from 'react';
import { TableCell } from 'material-ui/Table'

class TableCellWrapper  extends Component {
    handleClick = () => {
        const { rowId, cellIndex, onCellClick } = this.props;
        onCellClick(rowId, cellIndex);
    }

    render() {
        const { value } = this.props;
        return (
            <TableCell variant='body' onClick={this.handleClick}>
                {value}
            </TableCell>
        )
    }
}

export default TableCellWrapper ;