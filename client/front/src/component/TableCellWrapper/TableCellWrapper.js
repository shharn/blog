// @flow
import React, { Component } from 'react';
import TableCell from '@material-ui/core/TableCell';

type Props = {
    rowId: number,
    cellName: string,
    value: string,

    onCellClick: (rowId:number, cellName: string) => void
};

class TableCellWrapper  extends Component<Props> {
    handleClick = () => {
        const { rowId, cellName, onCellClick } = this.props;
        onCellClick(rowId, cellName);
    }

    render = () => {
        const { value } = this.props;
        return (
            <TableCell variant='body' onClick={this.handleClick}>
                {value}
            </TableCell>
        )
    }
}

export default TableCellWrapper;