import React, { Component } from 'react';
import SocialIcons from '../SocialIcons';
import Hidden from 'material-ui/Hidden';
import Drawer from 'material-ui/Drawer';
import Settings from 'material-ui-icons/Settings';
import DrawerHeader from '../DrawerHeader';
import DrawerItems from '../DrawerItems';
import MenuManager from '../MenuManager';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

class ResponsiveDrawer extends Component {
    render() {
        const { classes, theme, toggleDrawer, smallScreenOpen, isAuthenticated } = this.props;
        return (
            <div>
                <Hidden smUp>
                    <Drawer variant="temporary" 
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={smallScreenOpen}
                        classes={{ paper: classes.drawerPaper }}
                        onClose={toggleDrawer}
                        ModalProps={{ keepMounted: true }}
                    >
                        <DrawerHeader/>
                        <DrawerItems/>
                        {isAuthenticated && <MenuManager/>}
                        <SocialIcons/>
                    </Drawer>
                </Hidden>
                <Hidden xsDown>
                    <Drawer variant="permanent" open classes={{ paper: classes.drawerPaper }}>
                        <DrawerHeader/>
                        <DrawerItems/>
                        {isAuthenticated && <MenuManager/>}
                        <SocialIcons/>
                    </Drawer>
                </Hidden>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ResponsiveDrawer);