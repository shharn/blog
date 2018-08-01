import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import styles from './styles';
import { Typography } from '../../../node_modules/@material-ui/core';

class MetaInfo extends Component {
    render() {
        const { classes, createdAt } = this.props;
        const time = new Date(createdAt);
        return (
            <div className={classes.root}>
                <Avatar
                    // alt="Seunghwan Han"
                    // src="/static/images/uxceo-128.jpg"
                    className={classes.avatar}>P</Avatar>
                <Typography className={classes.createdAt} variant="subheading">{time.toLocaleString('en-us', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
            </div>
        );
    }
}

export default withStyles(styles)(MetaInfo);