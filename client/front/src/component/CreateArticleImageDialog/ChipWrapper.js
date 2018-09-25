// @flow
import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import { chip } from './styles';
import type { WithStylesProps } from '../../flowtype';

type Props = {
    file: File,
    deleteFile: (name: string) => void
};

class ChipWrapper extends Component<Props & WithStylesProps> {
    onDelete = (): void => {
        const { file, deleteFile } = this.props;
        deleteFile(file.name);
    }

    render() {
        const { classes, file } = this.props;
        return (
            <Chip
                className={classes.chip}
                key={`filechip:${file.name}`}
                color="primary"
                label={file.name}
                onDelete={this.onDelete}/>
        );
    }
}

export default withStyles(chip)(ChipWrapper);