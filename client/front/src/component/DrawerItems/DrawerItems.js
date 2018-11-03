// @flow
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import DrawerItem from '../DrawerItem';
import styles from './styles';
import { FetchStatus as FetchStatusType } from '../../constant';
import type {
    Menu,
    WithStylesProps,
    ClientError
} from '../../flowtype';

type Props = {
    menus: Array<Menu>,
    error: ClientError,
    fetchStatus: $Values<FetchStatusType>,

    requestMenuData: () => void
};

class DrawerItems extends Component<Props & WithStylesProps> {
    componentDidMount = () => {
        this.props.requestMenuData();
    }

    render = () => {
        const { menus, fetchStatus, classes, error } = this.props;
        const notChildMenus =  menus && menus.filter(menu => !!menu.name).filter(menu => !!!menu.parent);
        return (
            fetchStatus === FetchStatusType.WAIT ?
                <CircularProgress size={30} className={classes.circularProgress}/> :
                fetchStatus === FetchStatusType.SUCCESS ?
                    <List className={classes.listContainer}>
                        {notChildMenus && notChildMenus.length > 0 ? 
                            notChildMenus.map(menu => <DrawerItem key={menu.uid} menu={menu} isChild={false}/>) :
                            <Typography className={classes.text}>No Menus</Typography>} 
                    </List> :
                    <Typography className={classes.text}>{error.message}</Typography>
        );
    }
}

export default withStyles(styles)(DrawerItems);