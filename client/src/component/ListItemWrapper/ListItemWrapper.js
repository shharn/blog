import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import type { Menu } from '../../flowtype';

type Props = {
    menu: Menu,
    onMenuClicked: (menu: Menu) => void
};

type State = {
    menuName: string,
    menuUrl: string,
    menuParentId: number
};

class ListItemWrapper extends Component<Props, State> {
    state = {
        menuName: this.props.menu.name,
        menuUrl: this.props.menu.url,
        menuParentId: this.props.parentId
    }

    handleListItemClick = e => {
        this.props.onMenuClicked(this.props.menu);
    }

    handleTouchStart = e => {
        console.log('touch start');
    }

    handleTouchCancel = e => {
        console.log('touch canceled');
    }

    handleTouchMove = e => {
        console.log('touch move');
    }

    handleTouchEnd = e => {
        console.log('touch end');
    }
    
    render() {
        const { menu } = this.props;
        return (
            <ListItem 
                button
                divider={true}
                onClick={this.handleListItemClick}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchCancel={this.handleTouchCancel}
                onTouchEnd={this.handleTouchEnd}
                >
                <ListItemText primary={menu.name}/>
            </ListItem>
        );
    }
}

export default ListItemWrapper;