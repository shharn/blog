import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class CenteredCircularProgress extends Component {
    render() {
        const { classes } = this.props;
        console.dir(classes);
        return (
            <div className={classes.centered} style={{
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '30px',
                height: '30px'
                }}>
                <CircularProgress size={30}/>
            </div>
        );
    }
}

export default withStyles(styles)(CenteredCircularProgress);