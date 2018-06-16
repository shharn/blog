import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
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
        e.preventDefault();
        const { openChild } = this.state;
        this.setState({ openChild: !openChild });
    }

    getRightElement = () => {
        const { url, name } = this.props.menu;
        const { classes, childMenus, isChild } = this.props;
        const hasChildren = childMenus && childMenus.length > 0;
        if (hasChildren) {
            return (
                <div>
                    <ListItem button component={Link} to={url} onClick={this.handleMenuClick}>
                        <ListItemText primary={name}/>
                        {this.state.openChild ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.openChild} timeout={700} unmountOnExit>
                        <List className={classes.nested} component="div">
                            {childMenus.map(child => <NestedDrawerItem key={child.uid} menu={child} isChild={true}/>)}
                        </List>
                    </Collapse>
                </div>
            );
        } else {
            return (
                <ListItem button component={Link} to={url}>
                    <ListItemText className={isChild && classes.nested} primary={name}/>
                </ListItem>
            )
        }
    }

    render() {
        return this.getRightElement();
    }
}

export default withStyles(styles, { withTheme: true })(DrawerItem);