// @flow
import React, { Component } from 'react';
import TopBar from '../TopBar';
import ResponsiveDrawer from '../ResponsiveDrawer';
import MainArea from '../MainArea';
import LoginModal from '../LoginModal';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import type { WithStylesProps } from '../../flowtype';

type Props = {
  isAuthenticated: boolean
};

type State = {
  smallScreenOpen: boolean,
  loginModalOpen: boolean
};

class Home extends Component<Props & WithStylesProps, State> {
  state = {
    smallScreenOpen: false,
    loginModalOpen: false
  };

  handleDrawerToggle = () => {
      this.setState({
        smallScreenOpen: !this.state.smallScreenOpen
      });
  }

  openLoginModal = (): void => {
    this.setState({
      loginModalOpen: true
    });
  }

  closeLoginModal = (): void => {
    this.setState({
      loginModalOpen: false
    });
  }

  render = () => {
    const { classes, isAuthenticated } = this.props;
    const { loginModalOpen } = this.state;
    return (
      <div className={classes.homeContainer}>
          <div className={classes.appFrame}>
              <TopBar 
                toggleDrawer={this.handleDrawerToggle}
                openLoginModal={this.openLoginModal}
                isAuthenticated={isAuthenticated}
              />
              <ResponsiveDrawer 
                toggleDrawer={this.handleDrawerToggle} 
                smallScreenOpen={this.state.smallScreenOpen} 
                isAuthenticated={isAuthenticated}
              />
              <MainArea />
              <LoginModal
                open={loginModalOpen}
                closeLoginModal={this.closeLoginModal}
              />
          </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);