import React, { Component } from 'react';
import Hidden from 'material-ui/Hidden';
import MenuList from '../MenuList';
import MenuListSmall from '../MenuListSmall';
import keycode from 'keycode';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

type Props = {
    classes: any,

    switchToList: () => void,
    switchToCreateMenu: () => void
};

class ResponsiveMenuList extends Component<Props> {
    onKeyUpOnContainer = (e) => {
        e.stopPropagation();
        switch(e.keycode) {
            case keycode('esc'): 
                this.props.switchToList();
                break;
            default:
                break;
        }
    }

    render() {
        const { classes, switchToList, switchToCreateMenu } = this.props;
        return (
            <div className={classes.responsiveMenuListContainer} onKeyUp={this.onKeyUpOnContainer}>
                <Hidden xsDown>
                    <MenuList switchToList={switchToList} switchToCreateMenu={switchToCreateMenu}/>
                </Hidden>
                <Hidden smUp>
                    <MenuListSmall switchToList={switchToList} switchToCreateMenu={switchToCreateMenu}/>
                </Hidden>
            </div>
        );
    }
}

export default withStyles(styles)(ResponsiveMenuList);