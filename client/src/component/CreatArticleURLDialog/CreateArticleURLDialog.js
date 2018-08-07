import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class CreateArticleURLDialog extends Component {
    constructor(props) {
        super(props);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onURLChange = this.onURLChange.bind(this);
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
        this.props.confirmLink(this.state.url);
        this.props.disableDialog();
    }

    onCancelClick(e) {
        e.preventDefault();
        this.props.disableDialog();
    }

    render() {
        const { showURLDialog } = this.props;
        return (
            <Dialog
                    open={showURLDialog}
                    onClose={this.handleDialogClose}
                    onEscapeKeyDown={this.handleEscKeyDown}
                    aria-labelledby="dialog-content"
                >
                    <DialogContent id="dialog-content" className=''>
                        <DialogContentText>
                            Enter the URL.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="url"
                            label="Landing uRL"
                            fullWidth
                            onChange={this.onURLChange}
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

export default CreateArticleURLDialog;