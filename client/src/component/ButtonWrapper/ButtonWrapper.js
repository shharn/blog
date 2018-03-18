// @flow
import React, { Component } from 'react';
import Delete from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';

type Props = {
    id: number,

    deleteMenu: (id: number) => void
}

class ButtonWrapper extends Component<Props> {
    handleClick = () => {
        this.props.deleteMenu(this.props.id)
    }

    render() {
        return (
            <IconButton aria-label="Delete" onClick={this.handleClick} >
                <Delete/>
            </IconButton>
        );
    }
}

export default ButtonWrapper;