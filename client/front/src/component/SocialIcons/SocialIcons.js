// @flow
import React, { Component } from 'react';
import SocialIcon from '../SocialIcon';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import iconData from './iconData';

import type {
    WithStylesProps
} from '../../flowtype';

class SocialIcons extends Component<WithStylesProps> {
    render = () => {
        const { classes } = this.props;
        return (
             <div className={classes.socialIcons}>
                {iconData.map(datum => <SocialIcon key={datum.href} datum={datum}/>)}
            </div>
        );
    }
}

export default withStyles(styles)(SocialIcons);