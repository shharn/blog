// @flow
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { TableCell } from 'material-ui/Table';
import keycode from 'keycode';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

type Props = {
    classes: any,
    rowId: number,
    cellName: string,
    value: string,

    onEnterKeyUp: (value: string) => void,
    onEscKeyUp: () => void
}

type State = {
    textValue: string
}

class EditableCell extends Component<Props, State> {
    state = {
        textValue: this.props.value
    }

    handleMouseClick = (event: SyntheticEvent<>) => {
        event.stopPropagation();
    }

    handleKeyUp = (event: SyntheticKeyboardEvent<>) => {
        const { textValue } = this.state
        switch(event.keyCode) {
            case keycode('enter'):
                this.state.textValue !== this.props.value && this.props.onEnterKeyUp(textValue)
                this.props.onEscKeyUp()
                break;
            case keycode('esc'):
                this.props.onEscKeyUp();
                break;
            default:
                return;
        }
    }

    handleTextChange = (event) => {
        this.setState({
            textValue: event.currentTarget.value
        });
    }

    render() {
        const { rowId, cellName, classes } = this.props;
        return (
            <TableCell variant='body' key={`${rowId}:${cellName}`}>
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