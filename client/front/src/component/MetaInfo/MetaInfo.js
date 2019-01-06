// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import styles from './styles';
import { Typography } from '@material-ui/core';
import type { WithStylesProps } from '../../flowtype';

type Props = {
    createdAt: string
};

class MetaInfo extends Component<Props & WithStylesProps> {
    render = () => {
        const { classes, createdAt } = this.props;
        const time = new Date(createdAt);
        return (
            <div className={classes.root}>
                <Avatar
                    alt="Seunghwan Han"
                    src="https://storage.googleapis.com/puppyloper-blog/images/me_icon_2_50x50.png"
                    className={classes.avatar}></Avatar>
                <Typography 
                    className={classes.createdAt} 
                    variant="subheading">
                    {time.toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles)(MetaInfo);