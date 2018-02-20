import React, { Component } from 'react';
import List from 'material-ui/List';
import DrawerItem from '../DrawerItem';
import styles from './styles';
import { withStyles } from 'material-ui/styles';

class DrawerItems extends Component {
    render() {
        const items = [
            { url: 'http://localhost:3000/admin', title: 'Admin' },
            { url: 'http://localhost:3000', title: 'Home' }
        ];
        const { classes } = this.props;
        return (
            <List className={classes.listContainer}>
                {items.map(item => <DrawerItem item={item}/>)}
            </List>
        );
    }
}

export default withStyles(styles)(DrawerItems);