import React, { Component } from 'react';
import TopBar from '../TopBar';
import { withStyles } from 'material-ui/styles';
import ResponsiveDrawer from '../ResponsiveDrawer';
import MainArea from '../MainArea';
import styles from './styles';

type Props = {
  isAuthenticated: boolean,
  classes: any
};

type State = {
  smallScreenOpen: boolean
};

class Home extends Component<Props, State> {
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
              <MainArea path={this.props.location.pathname} />
          </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);