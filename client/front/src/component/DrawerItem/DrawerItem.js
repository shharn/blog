// @flow
import * as React from 'react';
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
import type { Element } from 'react';
import type { 
    Menu,
    WithStylesProps
 } from '../../flowtype';

type Props = {
    menu: Menu,
    childMenus: Array<Menu>
};

type State = {
    openChild: boolean
};

class DrawerItem extends React.Component<Props & WithStylesProps, State> {
    state = {
        openChild: false
    }

    handleMenuClick = (e: SyntheticMouseEvent<HTMLButtonElement>): void => {
        const { openChild } = this.state;
        this.setState({ openChild: !openChild });
    }

    getRightElement = (): Element<*> => {
        const { name, url } = this.props.menu;
        const { classes, childMenus } = this.props;
        const hasChildren = childMenus && childMenus.length > 0;
        if (hasChildren) {
            return (
                <React.Fragment>
                    <ListItem button onClick={this.handleMenuClick}>
                        <ListItemText primary={name}/>
                        {this.state.openChild ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.openChild} timeout={700} unmountOnExit>
                        <List className={classes.nested} component="div">
                            {childMenus.map(child => <NestedDrawerItem key={child.uid} menu={child}/>)}
                        </List>
                    </Collapse>
                </React.Fragment>
            );
        } else {
            let to = url && url.length > 0 ? url : `/menus/${encodeURIComponent(name)}/articles`;
            return (
                <ListItem button component={Link} to={to}>
                    <ListItemText primary={name}/>
                </ListItem>
            )
        }
    }

    render = () => {
        return this.getRightElement();
    }
}

export default withStyles(styles, { withTheme: true })(DrawerItem);