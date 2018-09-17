// @flow
import React, { Component } from 'react';
import TableCell from '@material-ui/core/TableCell';
import Delete from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';

type Props = {
    deleteMenu: () => void
};

class DeleteButtonCell extends Component<Props> {
    handleClick = () => {
        this.props.deleteMenu();
    }

    render = () => {
        return (
            <TableCell>
                <Button aria-label="Delete" onClick={this.handleClick} >
                    <Delete/>
                </Button>
            </TableCell>
        );
    }
}

export default DeleteButtonCell;