// @flow
import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { ImageUploadStatus } from '../../constant';
import styles from './styles';

import type {
    WithStylesProps
} from '../../flowtype';

type Props = {
    progress: number,
    uploadStatus: $Values<ImageUploadStatus>,

    onConfirm: (files: Array<File>) => void,
    initializeStatus: () => void,
    uploadImage: (files: Array<File>) => void
};

type State = {
    files: Array<File>
};

class CreateArticleImageDialog extends React.Component<Props & WithStylesProps, State> {
    state = {
        files: []
    };

    componentDidUpdate = (prevProps) => {
        if (!prevProps.showImageDialog && this.props.showImageDialog) {
            this.setState({
                files: []
            });
        }

        if (prevProps.uploadStatus !== ImageUploadStatus.SUCCESS &&
            this.props.uploadStatus === ImageUploadStatus.SUCCESS) {
            this.props.onConfirm(this.state.files);
            this.props.initializeStatus();
            this.props.disableDialog();
        }
    }

    onFileChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
        const { files: oldFiles } = this.state;
        const { files } = e.target;
        setTimeout(() => 
            this.setState({
                files: [ ...oldFiles, ...files ]
            }) 
        , 0);
    }

    onDialogClose = (): void => {
        this.props.disableDialog();
    }

    onEscKeyDown = (e: SyntheticKeyboardEvent<>):void => {
        e.stopPropagation();
        e.preventDefault();
        this.props.disableDialog();
    }

    onCancelClick = (): void => {
        this.props.disableDialog();
    }

    onSubmitClick = (): void => {
        if (this.props.uploadStatus === ImageUploadStatus.SUCCESS) {
            alert(`You've already submitted files`);
            return;
        }
        const { files } = this.state;
        this.props.uploadImage(files);
    }

    onDeleteFile = (name: string): void => {
        const { files } = this.state;
        const filtered = files.filter(file => file.name !== name);
        this.setState({
            files: filtered
        });
    }

    render = () => {
        const { classes, showImageDialog, uploadStatus } = this.props;
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
                        <div className={classes.filesContainer}>
                            {files.map(file => <Chip
                                className={classes.chip}
                                key={`filechip:${file.name}`}
                                color="primary"
                                label={file.name}
                                onDelete={this.onDeleteFile(file.name)}/>)}
                        </div> :
                        <React.Fragment>
                            <Typography 
                                className={classes.emptyText} 
                                variant="body1" 
                            >
                                    Click to add images
                            </Typography>
                            <input onChange={this.onFileChange} className={classes.inputFile} type="file" accept="image/*" multiple/>
                        </React.Fragment>
                    }
                </DialogContent>
                {files.length > 0 &&
                    <DialogActions>
                        <Button onClick={this.onCancelClick} color="primary">
                            {uploadStatus === ImageUploadStatus.SUCCESS ? 'Exit' : 'Cancel'}
                        </Button>
                        <Button onClick={this.onSubmitClick} color="primary">
                            Submit
                        </Button>
                    </DialogActions>}
                {uploadStatus === ImageUploadStatus.UPLOADING && 
                    <LinearProgress variant="indeterminate" color="secondary"/>}
            </Dialog>
        );
    }
}

export default withStyles(styles)(CreateArticleImageDialog);