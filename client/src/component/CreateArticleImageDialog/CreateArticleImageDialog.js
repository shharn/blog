import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AttachFile from '@material-ui/icons/AttachFile';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import styles from './styles';

const PICK_FILE_MODE = 'PICK_FILE';
const IMAGE_LINK_MODE = 'IMAGE_LINK_MODE';

class CreateArticleImageDialog extends Component {
    constructor(props) {
        super(props);

        this.onDialogClose = this.onDialogClose.bind(this);
        this.onURLChange = this.onURLChange.bind(this);
        this.state = {
            mode: PICK_FILE_MODE,
            uri: '',
        };
    }

    onDialogClose() {
        this.props.disableImageDialog();
    }

    onEscKeyDown() {
        this.props.disableImageDialog();
    }

    onURLChange(e) {
        this.setState({
            uri: e.target.value
        });
    }

    onTextFieldKeyDown(e) {
        if (e.keyCode === keycode('enter')) {
            this.props.confirmImage(this.state.url)
        }
    }

    render() {
        const { classes, showImageDialog } = this.props;
        const { mode } = this.state;
        return (
            <Dialog
                open={showImageDialog}
                onClose={this.onDialogClose}
                onEscapeKeyDown={this.onEscKeyDown}
                aria-labelledby="dialog-content"
            >
                <DialogContent id="dialog-content" className={classes.content}>
                    {mode === IMAGE_LINK_MODE ?
                        <TextField
                            autoFocus
                            margin="dense"
                            id="imageURL"
                            label="Image URL"
                            fullWidth
                            onChange={this.onURLChange}
                            onKeyDown={this.onTextFieldKeyDown}
                            /> :
                        <div className={classes.filePickerContainer}>
                            <TextField
                                disabled
                                margin="dense"
                                id="fileName"
                                label="Image File Name"
                                fullWidth
                                />
                            <Button mini onClick
                        </div>
                    }
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

export default withStyles(styles)(CreateArticleImageDialog);