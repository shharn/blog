import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List'
import Button from 'material-ui/Button'
import AddIcon from 'material-ui-icons/Add'
import { withStyles } from 'material-ui/styles'
import styles from './styles'

import type { Menu } from '../../flowtype'

type Props = {
    menus: Array<Menu>,

    toggleComponent: () => void
}

class MenuListSmall extends Component {
    handleListItemClick = e => {
        //console.dir(e)
    }

    handleTouchStart = e => {
        console.log('touch start')
    }

    handleTouchCancel = e => {
        console.log('touch canceled')
    }

    handleTouchMove = e => {
        console.log('touch move')
    }

    handleTouchEnd = e => {
        console.log('touch end')
    }

    render() {
        const { classes, menus } = this.props
        return (
            <div className={classes.container}>
                <List component="nav" className={classes.listContainer}>
                    {menus.map(menu => (
                        <ListItem button divider={true} draggable={true}
                            onClick={this.handleListItemClick}
                            onTouchStart={this.handleTouchStart}
                            onTouchMove={this.handleTouchMove}
                            onTouchCancel={this.handleTouchCancel}
                            onTouchEnd={this.handleTouchEnd}
                            >
                            <ListItemText primary={menu.name}/>
                        </ListItem>
                    ))}
                </List>
                <Button className={classes.addButton} variant="fab" mini color="secondary" aria-label="add" onClick={this.props.toggleComponent}>
                    <AddIcon/>
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(MenuListSmall)