// @flow
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import styles from './styles';

import type {
    WithStylesProps
} from '../../flowtype';

type Props = {
    showDialog: boolean, 

    disableDialog: () => void,
    onConfirm: (src: string) => void
};

type State = {
    url: string
};

class CreateArticleURLDialog extends Component<Props & WithStylesProps, State> {
    state = {
        url: ''
    }

    onURLChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
        this.setState({
            url: e.target.value
        });
    }

    onSubmitClick = (e: SyntheticMouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        this.submitURL();
        this.props.disableDialog();
    }

    onCancelClick = (e: SyntheticMouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        this.props.disableDialog();
    }

    onEscKeyDown = (e: SyntheticKeyboardEvent<>): void => {
        e.preventDefault();
        e.stopPropagation();
        this.props.disableDialog();
    }

    onTextFieldKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>): void => {
        if (e.keyCode === keycode('enter')) {
            this.submitURL();
            this.props.disableDialog();
        }
    }

    onDialogClose = (): void => {
        this.props.disableDialog();
    }

    submitURL= (): void => {
        const { url } = this.state;
        const protocolEnsuredURL = this.ensureProtocol(url);
        this.props.onConfirm(protocolEnsuredURL);
    }

    ensureProtocol = (url: string): string => {
        if (!/^https?:\/\/.*/.test(url)) {
            return `https://${url}`;        
        }
        return url;
    }

    render = () => {
        const { showURLDialog, classes } = this.props;
        return (
            <Dialog
                open={showURLDialog}
                onClose={this.onDialogClose}
                onEscapeKeyDown={this.onEscKeyDown}
                aria-labelledby="dialog-content"
            >
                <DialogContent id="dialog-content" className={classes.content}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="url"
                        label="Landing URL"
                        fullWidth
                        onChange={this.onURLChange}
                        onKeyDown={this.onTextFieldKeyDown}
                        />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onCancelClick} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.onSubmitClick} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(CreateArticleURLDialog);