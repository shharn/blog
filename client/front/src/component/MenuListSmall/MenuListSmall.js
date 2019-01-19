// @flow
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ListItemWrapper from '../ListItemWrapper';
import { Typography } from '@material-ui/core';
import styles from './styles';
import type { 
    Menu,
    WithStylesProps
} from '../../flowtype';

type Props = {
    menus: Array<Menu>,

    switchToEditMenu: (menu: Menu) => void,
    switchToList: () => void,
    switchToCreateMenu: () => void
};

class MenuListSmall extends Component<Props & WithStylesProps> {
    switchToEditMenu = (menu: Menu): void => {
        this.props.switchToEditMenu(menu);
    }

    onAddButtonClicked = (): void => {
        this.props.switchToCreateMenu();
    }

    render = () => {
        const { classes, menus } = this.props;
        return (
            <div className={classes.container}>
                {menus.length > 0 ?
                <List component="nav" className={classes.listContainer}>
                    {menus.map(menu => <ListItemWrapper key={`$MenuItem:${menu.uid}`} onMenuClicked={this.switchToEditMenu} menu={menu}/>)}
                </List> :
                <Typography
                    className={classes.emptyMessage}
                    variant="h6"
                    align="center">
                    No Menu :(
                </Typography>
                }
                <Button className={classes.addButton} variant="fab" mini color="secondary" aria-label="add" onClick={this.onAddButtonClicked}>
                    <AddIcon/>
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(MenuListSmall);