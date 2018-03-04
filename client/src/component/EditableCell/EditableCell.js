import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { TableCell } from 'material-ui/Table';
import keycode from 'keycode';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

class EditableCell extends Component {
    state = {
        textValue: this.props.value
    }

    handleMouseClick = event => {
        event.stopPropagation();
    }

    handleKeyUp = event => {
        switch(event.keyCode) {
            case keycode('enter'):
                this.state.textValue === this.props.value ? 
                    this.props.onEscKeyUp() :
                    this.props.onEnterKeyUp();
                break;
            case keycode('esc'):
                this.props.onEscKeyUp();
                break;
            default:
                return;
        }
    }

    handleTextChange = event => {
        this.setState({
            textValue: event.target.value
        });
    }

    render() {
        const { rowId, cellIndex, classes } = this.props;
        return (
            <TableCell variant='body' key={`${rowId}:${cellIndex}`}>
                <TextField
                    InputProps={{
                        classes: {
                            input: classes.inputField
                        }
                    }}
                    autoFocus={true} required 
                    value={this.state.textValue} 
                    onKeyUp={this.handleKeyUp}
                    onChange={this.handleTextChange}
                    onClick={this.handleMouseClick}/>
            </TableCell>
        );
    }
}

export default withStyles(styles, { withTheme: true })(EditableCell);