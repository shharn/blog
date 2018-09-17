import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';

import type {
    WithStylesProps
} from '../../flowtype';

class DrawerHeader extends Component<WithStylesProps> {
    render = () =>{
        const { classes } = this.props;
        return (
            <a href="/" className={classes.drawerHeader}>
                <div>
                    <Typography variant="title">Puppyloper's blog</Typography>
                </div>
                <div>
                    <Typography variant="caption">I'm software engineer :)</Typography>
                </div>
            </a>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DrawerHeader);