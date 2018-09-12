// @flow
import React, { Component } from 'react';
import TopBar from '../TopBar';
import ResponsiveDrawer from '../ResponsiveDrawer';
import MainArea from '../MainArea';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

import type {
    WithStylesProps
} from '../../flowtype';

type Props = {
  isAuthenticated: boolean,
};

type State = {
  smallScreenOpen: boolean
};

class Home extends Component<Props & WithStylesProps, State> {
  state = {
    smallScreenOpen: false
  };

  handleDrawerToggle = () => {
      this.setState({
        smallScreenOpen: !this.state.smallScreenOpen
      });
  }

  render() {
    const { classes, isAuthenticated } = this.props;
    return (
      <div className={classes.homeContainer}>
          <div className={classes.appFrame}>
              <TopBar toggleDrawer={this.handleDrawerToggle} isAuthenticated={isAuthenticated}/>
              <ResponsiveDrawer toggleDrawer={this.handleDrawerToggle} smallScreenOpen={this.state.smallScreenOpen} isAuthenticated={isAuthenticated}/>
              <MainArea/>
          </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);