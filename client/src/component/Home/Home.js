import React, { Component } from 'react';
import TopBar from '../TopBar';
import ResponsiveDrawer from '../ResponsiveDrawer';
// import { Route } from 'react-router';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import Loadable from 'react-loadable';
import MainArea from '../MainArea';

import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

// const HottestArticleList = Loadable({
//   loader: () =>  import('../HottestArticleList'),
//   loading: () => <CircularProgress size={30}/>
// });

// const ArticleListWrapper  = Loadable({
//   loader: () => import('../ArticleListWrapper'),
//   loading: () => <CircularProgress size={30}/>
// });

// const CreateArticle = Loadable({
//   loader: () => import('../CreateArticle'),
//   loading: () => <CircularProgress size={30}/>
// });

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
    console.dir(this.props);
    return (
      <div className={classes.homeContainer}>
          <div className={classes.appFrame}>
              <TopBar toggleDrawer={this.handleDrawerToggle} isAuthenticated={isAuthenticated}/>
              <ResponsiveDrawer toggleDrawer={this.handleDrawerToggle} smallScreenOpen={this.state.smallScreenOpen} isAuthenticated={isAuthenticated}/>
              <MainArea/>
              {/* <main className={classes.mainArea}>
                <Route exact path="/" component={HottestArticleList}/>
                <Route path="menus/:menuName/articles" component={ArticleListWrapper}/>
                {/* <Route path="/createArticle" component={CreateArticle}/> */}
              {/* </main> */}
          </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);