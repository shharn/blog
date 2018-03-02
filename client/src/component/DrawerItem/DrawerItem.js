import React, { Component } from 'react';
import { ListItem, ListItemText } from 'material-ui/List';
import { Link } from 'react-router-dom';

class DrawerItem extends Component {
    render() {
        const { url, title } = this.props.menu;
        return (
            <ListItem button component={Link} to={url}>
                <ListItemText primary={title}/>
            </ListItem>
        );
    }
}

export default DrawerItem;