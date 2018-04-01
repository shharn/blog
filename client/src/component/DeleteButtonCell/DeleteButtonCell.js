import React, { Component } from 'react';
import { TableCell } from 'material-ui/Table';
import Delete from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

type Props = {
    deleteMenu: () => void
};

class DeleteButtonCell extends Component {
    handleClick = () => {
        this.props.deleteMenu();
    }

    render() {
        return (
            <TableCell>
                <IconButton aria-label="Delete" onClick={this.handleClick} >
                    <Delete/>
                </IconButton>
            </TableCell>
        );
    }
}

export default DeleteButtonCell;