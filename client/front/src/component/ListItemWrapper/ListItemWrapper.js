// @flow
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
    menuParentId: string
};

class ListItemWrapper extends Component<Props, State> {
    state = {
        menuName: this.props.menu.name,
        menuUrl: this.props.menu.url,
        menuParentId: this.props.menu.parent ? this.props.menu.parent[0].uid : '0'
    }

    handleListItemClick = (e: SyntheticMouseEvent<HTMLElement>): void => {
        this.props.onMenuClicked(this.props.menu);
    }

    handleTouchStart = (e: SyntheticTouchEvent<HTMLElement>): void => {
        console.log('touch start');
    }

    handleTouchCancel = (e: SyntheticTouchEvent<HTMLElement>): void => {
        console.log('touch canceled');
    }

    handleTouchMove = (e: SyntheticTouchEvent<HTMLElement>): void => {
        console.log('touch move');
    }

    handleTouchEnd = (e: SyntheticTouchEvent<HTMLElement>): void => {
        console.log('touch end');
    }
    
    render = () => {
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