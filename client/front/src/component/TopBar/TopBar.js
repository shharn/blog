// @flow
import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import EmptyCenter from './EmptyCenter';
import Button from '@material-ui/core/Button';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import ExitToApp from '@material-ui/icons/ExitToApp';
import styles from './styles';
import type { WithStylesProps } from '../../flowtype';

type Props = {
    isAuthenticated: boolean,

    toggleDrawer: () => void,
    logout: () => void
};

class TopBar extends Component<Props & WithStylesProps> {
    // handleSearchToggle = (): void => {
    //     console.log('handleSearchToggle');
    // }

    handleAuthButtonClick = (): void => {
        const { isAuthenticated } = this.props;
        isAuthenticated ? this.props.logout() : this.props.history.push('/login');
    }

    render = () => {
        const { classes, toggleDrawer, isAuthenticated } = this.props;
        return (
            <AppBar className={classes.appBar}>
                  <Toolbar classes={{ root: classes.toolBar}}>
                      <div>
                          <IconButton className={classes.navHamburgerIcon} onClick={toggleDrawer}>
                              <MenuIcon />
                          </IconButton>  
                      </div>
                      <EmptyCenter />
                      {/* <div>
                          <IconButton className={classes.navSearchIcon} onClick={this.handleSearchToggle}>
                              <SearchIcon/>
                          </IconButton>
                          <TextField className={classes.searchInput} placeholder="Search"></TextField>
                      </div> */}
                    <div className={classes.buttonContainer}>
                        <Button
                            classes={{
                                root: classes.toggleButton
                            }}
                            aria-label={isAuthenticated ? "logout" : "login"}
                            onClick={this.handleAuthButtonClick}>
                            {isAuthenticated ? 
                                <ExitToApp /> : 
                                <PowerSettingsNew />}
                        </Button>
                    </div>
                  </Toolbar>
              </AppBar>
        );
    }
}

export default withStyles(styles, { withTheme: true })(TopBar);