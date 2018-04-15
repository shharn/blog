import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import DrawerItemSelf from './index';
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
        const { url, name, childrenIDs } = this.props.menu;
        const { classes, children } = this.props;
        const hasChildren = childrenIDs.length > 0;
        if (hasChildren) {
            return (
                <div>
                    <ListItem button component={Link} to={url} onClick={this.handleMenuClick}>
                        <ListItemText className={classes.nested} primary={name}/>
                        {this.state.openChild ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.openChild} timeout={700} unmountOnExit>
                        <List component="div">
                            {children.map(child => <DrawerItemSelf key={child.id} menu={child} isChild={true}/>)}
                        </List>
                    </Collapse>
                </div>
            );
        } else {
            return (
                <ListItem button component={Link} to={url}>
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