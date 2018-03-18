import React, { Component } from 'react';
import styles from './styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TopBar from '../TopBar';
import { withStyles } from 'material-ui/styles';
import ResponsiveDrawer from '../ResponsiveDrawer';

class Home extends Component {
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
              <main className={classes.content}>
                  <Typography>Main Content</Typography>
                  <Button variant="raised" color="secondary">Test</Button>
              </main>
          </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);