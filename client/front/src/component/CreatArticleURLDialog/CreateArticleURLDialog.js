import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import styles from './styles';

class CreateArticleURLDialog extends Component {
    constructor(props) {
        super(props);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onURLChange = this.onURLChange.bind(this);
        this.onEscKeyDown = this.onEscKeyDown.bind(this);
        this.onDialogClose = this.onDialogClose.bind(this);
        this.onTextFieldKeyDown = this.onTextFieldKeyDown.bind(this);
        this.state = {
            url: ''
        };
    }

    onURLChange(e) {
        this.setState({
            url: e.target.value
        });
    }

    onSubmitClick(e) {
        e.preventDefault();
        this.props.onConfirm(this.state.url);
        this.props.disableDialog();
    }

    onCancelClick(e) {
        e.preventDefault();
        this.props.disableDialog();
    }

    onEscKeyDown(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.disableDialog();
    }

    onTextFieldKeyDown(e) {
        if (e.keyCode === keycode('enter')) {
            this.props.onConfirm(this.state.url);
        }
    }

    onDialogClose() {
        this.props.disableDialog();
    }

    render() {
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