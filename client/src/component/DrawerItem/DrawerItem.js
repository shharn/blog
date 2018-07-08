import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import NestedDrawerItem from './index';
import styles from './styles';

import type { Menu } from '../../flowtype';

type Props = {
    classes: any,
    menu: Menu,
    children: Array<Menu>
}

class DrawerItem extends Component<Props> {
    state = {
        openChild: false
    }

    handleMenuClick = (e) => {
        const { openChild } = this.state;
        this.setState({ openChild: !openChild });
    }

    getRightElement = () => {
        const { name, uid, url } = this.props.menu;
        const { classes, childMenus } = this.props;
        const hasChildren = childMenus && childMenus.length > 0;
        if (hasChildren) {
            return (
                <div>
                    <ListItem button onClick={this.handleMenuClick}>
                        <ListItemText primary={name}/>
                        {this.state.openChild ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.openChild} timeout={700} unmountOnExit>
                        <List className={classes.nested} component="div">
                            {childMenus.map(child => <NestedDrawerItem key={child.uid} menu={child}/>)}
                        </List>
                    </Collapse>
                </div>
            );
        } else {
            let to = url && url.length > 0 ? url : `/menus/${uid}/articles`;
            return (
                <ListItem button component={Link} to={to}>
                    <ListItemText primary={name}/>
                </ListItem>
            )
        }
    }

    render() {
        return this.getRightElement();
    }
}

export default withStyles(styles, { withTheme: true })(DrawerItem);