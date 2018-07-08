import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import DrawerItem from '../DrawerItem';
import styles from './styles';
import { FetchStatus as FetchStatusType } from '../../constant';

class DrawerItems extends Component {
    componentDidMount() {
        this.props.requestMenuData();
    }

    render() {
        const { menus, fetchStatus, fetchComplete, classes, error } = this.props;
        const notChildMenus =  menus && menus.filter(menu => !menu.parent);
        return (
            fetchComplete ? 
            <List className={classes.listContainer}>
                {fetchStatus === FetchStatusType.FETCH_SUCCESS ?
                    notChildMenus == null ? 
                        <Typography className={classes.text}>No Menus</Typography> : 
                        notChildMenus.map(menu => <DrawerItem key={menu.uid} menu={menu} isChild={false}/>) :
                    <Typography className={classes.text}>{error.message}</Typography>}
            </List> :
            <CircularProgress size={30} className={classes.circularProgress}/>
        );
    }
}

export default withStyles(styles)(DrawerItems);