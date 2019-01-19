import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import NoSsr from '@material-ui/core/NoSsr';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class CenteredCircularProgress extends Component {
    render() {
        const { classes } = this.props;
        return (
            <NoSsr>
                <div className={classes.centered}>
                    <CircularProgress size={30}/>
                </div>
            </NoSsr>
        );
    }
}

export default withStyles(styles)(CenteredCircularProgress);