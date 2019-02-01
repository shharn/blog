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

    uploadImage: (file: File) => void
}

type State = {
    imageURL: string,
    file?: File
}

const IMAGE_BASE_URL = `https://storage.googleapis.com/${process.env.NODE_ENV === 'production' ? 'puppyloper-blog' : 'puppyloper-test'}/images`;

class MainImageUploadForm extends Component<Props & WithStylesProps, State> {
    state = {
        imageURL: '',
        file: null
    };

    componentDidUpdate() {
        const { uploadStatus } = this.props;
        if (uploadStatus === ImageUploadStatus.SUCCESS) {
            const { file } = this.state;
            this.setState({
                imageURL: `${IMAGE_BASE_URL}/${file.name}`
            })
        }
    }

    onFileInputChange = (e: File): void => {
        const file = e.target.files[0];
        this.setState({
            file
        }, () => this.props.uploadImage(file));
    }

    render = () => {
        const { classes } = this.props;
        const { imageURL } = this.state;
        return (
            <FormControl 
                    fullWidth
                    classes={{
                        root: classes.formContainer
                    }}>
                    <div>Main Image URL</div>
                    <div className={classes.imageUploadFormContainer}>
                        <Typography className={classes.imageUploadFormLabel}>{imageURL}</Typography>
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