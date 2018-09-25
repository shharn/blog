// @flow
import React, { Component } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import type { WithStylesProps } from '../../flowtype';

type Props = {
    rowId: number,
    cellName: string,
    value: string,

    onCellClick: (rowId:number, cellName: string) => void
};

class TableCellWrapper  extends Component<Props & WithStylesProps> {
    handleClick = () => {
        const { rowId, cellName, onCellClick } = this.props;
        onCellClick(rowId, cellName);
    }

    render = () => {
        const { classes, value } = this.props;
        return (
            <TableCell 
                classes={{
                    root: classes.root
                }}
                variant='body' 
                onClick={this.handleClick}>
                {value}
            </TableCell>
        )
    }
}

export default withStyles(styles)(TableCellWrapper);