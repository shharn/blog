import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import SearchIcon from 'material-ui-icons/Search';
import EmptyCenter from './EmptyCenter';
import styles from './styles';

class TopBar extends Component {
    render() {
        console.dir(this.props);
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
                      <div>
                          {isAuthenticated ? <span>Authenticated</span> : void 0}
                          <IconButton className={classes.navSearchIcon} onClick={this._handleSearchToggle}>
                              <SearchIcon/>
                          </IconButton>
                          <TextField className={classes.searchInput} placeholder="Search"></TextField>
                      </div>
                  </Toolbar>
              </AppBar>
        );
    }
}

export default withStyles(styles, { withTheme: true })(TopBar);