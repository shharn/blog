import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
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

    handleMouseOver = (e) => {
        this.setState({ openChild: true });
    }

    handleMouseLeave = (e) => {
        this.setState({ openChild: false });
    }

    render() {
        const { url, name, childrenIDs } = this.props.menu;
        const { classes, children, isChild } = this.props;
        console.dir(classes);
        return (
            <div>
                <ListItem button component={Link} to={url} onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>
                    <ListItemText className={isChild === true ? classes.nested : ''} primary={name}/>
                    {childrenIDs.length > 0 && (this.state.openChild ? <ExpandLess/> : <ExpandMore/>)}
                </ListItem>
                {childrenIDs.length > 0 &&
                <Collapse in={this.state.openChild} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {children.map(child => <DrawerItem key={child.id} menu={child} isChild={true}/>)}
                    </List>
                </Collapse>
                }
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DrawerItem);