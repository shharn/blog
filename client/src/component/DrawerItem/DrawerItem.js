import React, { Component } from 'react';
import { ListItem, ListItemText } from 'material-ui/List';
import { Link } from 'react-router-dom';

class DrawerItem extends Component {
    render() {
        const { Url, Title } = this.props.menu;
        return (
            <ListItem button component={Link} to={Url}>
                <ListItemText primary={Title}/>
            </ListItem>
        );
    }
}

export default DrawerItem;