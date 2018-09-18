// @flow
import React, { Component } from 'react';
import Hidden from '@material-ui/core/Hidden';
import MenuList from '../MenuList';
import MenuListSmall from '../MenuListSmall';
import keycode from 'keycode';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import type { WithStylesProps } from '../../flowtype';

type Props = {
    switchToList: () => void,
    switchToCreateMenu: () => void
};

class ResponsiveMenuList extends Component<Props & WithStylesProps> {
    onKeyUpOnContainer = (e: SyntheticKeyboardEvent<*>): void => {
        e.stopPropagation();
        switch(e.keyCode) {
            case keycode('esc'): 
                this.props.switchToList();
                break;
            default:
                break;
        }
    }

    render = () => {
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