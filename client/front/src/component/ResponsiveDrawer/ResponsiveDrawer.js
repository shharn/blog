// @flow
import * as React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import DrawerHeader from '../DrawerHeader';
import DrawerItems from '../DrawerItems';
import MenuManager from '../MenuManager';
import SocialIcons from '../SocialIcons';
import styles from './styles';

import type {
    WithStylesProps
} from '../../flowtype';

type Props = {
    isAuthenticated: boolean,
    toggleDrawer: () => void,
    smallScreenOpen: boolean
};

class ResponsiveDrawer extends React.Component<Props & WithStylesProps> {
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