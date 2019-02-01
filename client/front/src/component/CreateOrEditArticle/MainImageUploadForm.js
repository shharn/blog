// @flow
import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ImageUploadStatus } from '../../constant';
import styles from './styles';

import type { WithStylesProps } from '../../flowtype';

type Props = {
    uploadStatus: $Values<ImageUploadstatus>,

    uploadImage: (file: File) => void,
    updateImageSource: (imageSource: string) => void
}

type State = {
    file?: File
}

const IMAGE_BASE_URL = `https://storage.googleapis.com/${process.env.NODE_ENV === 'production' ? 'puppyloper-blog' : 'puppyloper-test'}/images`;

class MainImageUploadForm extends Component<Props & WithStylesProps, State> {
    state = {
        file: null
    };

    componentDidUpdate() {
        const { uploadStatus } = this.props;
        const { file } = this.state;
        if (uploadStatus === ImageUploadStatus.SUCCESS && file) {
            const imageSource = `${IMAGE_BASE_URL}/${file.name}`
            this.props.updateImageSource(imageSource);
        }
    }

    onFileInputChange = (e: File): void => {
        const file = e.target.files[0];
        this.setState({
            file
        }, () => this.props.uploadImage(file));
    }

    render = () => {
        const { classes, imageSource } = this.props;
        return (
            <FormControl 
                    fullWidth
                    classes={{
                        root: classes.formContainer
                    }}>
                    <div>Main Image URL</div>
                    <div className={classes.imageUploadFormContainer}>
                        <Typography className={classes.imageUploadFormLabel}>{imageSource}</Typography>
                        <Button className={classes.imageUploadFormButton} variant="contained" color="primary">Upload</Button>
                        <input 
                            className={classes.hiddenFileInput}
                            onInput={this.onFileInputChange}
                            type="file" 
                            accept="image/*"
                            name="main"/>
                    </div>
                </FormControl>
        );
    }
}

export default withStyles(styles)(MainImageUploadForm);