// @flow
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import { FetchStatus } from '../../constant';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import styles from './styles';
import type { Mutation } from '../../reducer/data/mutation';
import type { WithStylesProps } from '../../flowtype';

type Props = {
    rowId: number,
    cellName: string,
    value: string,
    updateMenu: (cellName: string, value: string) => void,

    updateMutationState: Mutation,
    disableEditableCell: () => void
};

type State = {
    textValue: string
};

class EditableCell extends Component<Props & WithStylesProps, State> {
    state = {
        textValue: this.props.value
    }

    componentDidUpdate(): void {
        if (this.props.updateMutationState.status === FetchStatus.SUCCESS) {
            this.props.disableEditableCell();
        }
    }

    handleMouseClick = (e: SyntheticMouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
    }

    handleKeyUp = (e: SyntheticKeyboardEvent<>): void => {
        e.stopPropagation();
        const { cellName } = this.props;
        const { textValue } = this.state;
        switch(e.keyCode) {
            case keycode('enter'):
                if (this.state.textValue !== this.props.value && this.state.textValue.length > 0) {
                    this.props.updateMenu(cellName, textValue);
                }
                break;
            case keycode('esc'):
                this.props.disableEditableCell();
                break;
            default:
                return;
        }
    }

    handleTextChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
        this.setState({
            textValue: e.currentTarget.value
        });
    }

    render = () => {
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