import React, { Component } from 'react';
import List from 'material-ui/List';
import DrawerItem from '../DrawerItem';
import styles from './styles';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import { fetchStatus as fetchStatusType } from '../../constant';

class DrawerItems extends Component {
    componentDidMount() {
        this.props.requestMenuData();
    }

    render() {
        const { menus, fetchStatus, fetchComplete, classes, error } = this.props;
        return (
            fetchComplete ? 
            <List className={classes.listContainer}>
                {fetchStatus === fetchStatusType.FETCH_SUCCESS ?
                    menus == null ? <Typography className={classes.text}>No Menus</Typography> : menus.map(menu => <DrawerItem key={menu.Url} menu={menu}/>) :
                <Typography className={classes.text}>{error.message}</Typography>}
            </List> :
            <CircularProgress size={30} className={classes.circularProgress}/>
        );
    }
}

export default withStyles(styles)(DrawerItems);