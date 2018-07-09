// @flow
import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { Route } from 'react-router';
import Loadable from 'react-loadable';
import { makeInfiniteScrollable } from '../InfiniteScrollable';
import styles from './styles';

const HottestArticleList = Loadable({
    loader: () =>  import('../HottestArticleList'),
    loading: () => <CircularProgress size={30}/>
  });
  
  const ArticleList  = Loadable({
    loader: () => import('../ArticleList'),
    loading: () => <CircularProgress size={30}/>
  });

type Props = {
    classes: any,
    path: string,
}

class MainArea extends Component<Props> {
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.content}>
                <Route exact path="/" component={HottestArticleList}/>
                <Route path="/menus/:id/articles" component={ArticleList}/>
            </main>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MainArea);