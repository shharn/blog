import React, { Component } from 'react';
import List from 'material-ui/List'
import Button from 'material-ui/Button'
import ListItemWrapper from '../ListItemWrapper'
import AddIcon from 'material-ui-icons/Add'
import { withStyles } from 'material-ui/styles'
import styles from './styles'

import type { Menu } from '../../flowtype'

type Props = {
    menus: Array<Menu>,

    toggleComponent: (isEditMode, menu?: Menu) => void
}

class MenuListSmall extends Component {
    switchToEditWindow = (menu: Menu) => {
        this.props.toggleComponent(true, menu)
    }

    render() {
        const { classes, menus } = this.props
        return (
            <div className={classes.container}>
                <List component="nav" className={classes.listContainer}>
                    {menus.map(menu => <ListItemWrapper onMenuClicked={this.switchToEditWindow} menu={menu}/>)}
                </List>
                <Button className={classes.addButton} variant="fab" mini color="secondary" aria-label="add" onClick={this.props.toggleComponent}>
                    <AddIcon/>
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(MenuListSmall)