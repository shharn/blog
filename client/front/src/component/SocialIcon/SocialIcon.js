// @flow
import React, { Component } from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';

import type {
    WithStylesProps
} from '../../flowtype';

import type {
    IconData
} from '../SocialIcons/iconData';

type Props = {
    datum: IconData
};

class SocialIcon extends Component<Props & WithStylesProps> {
    render = () => {
        const { classes, datum } = this.props;
        return (
            <div className={classes.icon}>
                <a href={datum.href} target="_blank" rel="noopener noreferrer">
                    <img src={datum.imgSrc} alt={datum.alt}/>
                </a>
            </div>
        );
    }
}

export default withStyles(styles)(SocialIcon);