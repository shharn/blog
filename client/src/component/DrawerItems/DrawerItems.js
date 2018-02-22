import React, { Component } from 'react';
import List from 'material-ui/List';
import DrawerItem from '../DrawerItem';
import styles from './styles';
import { withStyles } from 'material-ui/styles';
import { getMenus } from '../../service';
import { CircularProgress } from 'material-ui/Progress';

class DrawerItems extends Component {
    state = {
        fetchComplete: false
    };

    componentDidMount() {
        getMenus().then(menus => this.setState({ menus, fetchComplete: true }));
    }

    render() {
        const { menus, fetchComplete } = this.state;
        const { classes } = this.props;
        return (
            fetchComplete ?
            <List className={classes.listContainer}>
                {menus.map(menu => <DrawerItem key={menu.Url} menu={menu}/>)}
            </List> :
            <CircularProgress size={30} className={classes.circularProgress}/>
        );
    }
}

export default withStyles(styles)(DrawerItems);