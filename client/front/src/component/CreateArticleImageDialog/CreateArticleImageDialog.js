import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class CreateArticleImageDialog extends Component {
    constructor(props) {
        super(props);

        this.onDialogClose = this.onDialogClose.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onEscKeyDown = this.onEscKeyDown.bind(this);
        this.onDeleteFile = this.onDeleteFile.bind(this);
        this.onClickEmptyText = this.onClickEmptyText.bind(this);
        this.state = {
            files: []
        };
    }

    onFileChange(e) {
        const { files: oldFiles } = this.state;
        const { files } = e.target;
        this.setState({
            files: [ ...oldFiles, ...files ]
        });
    }

    onDialogClose() {
        this.props.disableImageDialog();
    }

    onEscKeyDown() {
        this.props.disableImageDialog();
    }

    onCancelClick() {
        this.props.disableImageDialog();
    }

    onSubmitClick() {
        // const { files } = this.state;
        // this.props.uploadImage(files);
    }

    onDeleteFile(e) {
        console.log(e.target);
    }

    onClickEmptyText() {

    }

    render() {
        const { classes, showImageDialog } = this.props;
        const { files } = this.state;
        return (
            <Dialog
                open={showImageDialog}
                onClose={this.onDialogClose}
                onEscapeKeyDown={this.onEscKeyDown}
                aria-labelledby="dialog-content"
            >
                <DialogContent id="dialog-content" className={classes.content}>
                    {files.length > 0 ? 
                        // chips & file picker button
                        files.map(file => <Chip 
                            color="primary"
                            label={file.filename}
                            onDelete={this.onDeleteFile}/>) :
                        <React.Fragment>
                            <Typography 
                                className={classes.emptyText} 
                                variant="body1" 
                                onClick={this.onClickEmptyText}>
                                    Click to add images
                            </Typography>
                            <input className={classes.inputFile} type="file" accept="image/*" multiple/>
                        </React.Fragment>
                    }
                </DialogContent>
                {files.length > 0 &&
                    <DialogActions>
                        <Button onClick={this.onCancelClick} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.onSubmitClick} color="primary">
                            Submit
                        </Button>
                    </DialogActions>}
            </Dialog>
        );
    }
}

export default withStyles(styles)(CreateArticleImageDialog);