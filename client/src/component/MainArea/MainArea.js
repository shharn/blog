// @flow
import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { Route } from 'react-router';
import Loadable from 'react-loadable';
import styles from './styles';

const HottestArticleList = Loadable({
    loader: () =>  import('../HottestArticleList'),
    loading: () => <CircularProgress size={30}/>
  });
  
  const ArticleListWrapper  = Loadable({
    loader: () => import('../ArticleListWrapper'),
    loading: () => <CircularProgress size={30}/>
  });

  const CreateArticle = Loadable({
    loader: () => import('../CreateArticle'),
    loading: () => <CircularProgress size={30}/>
});

type Props = {
    classes: any,
}

class MainArea extends Component<Props> {
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.content}>
                <Route exact path="/" component={HottestArticleList}/>
                <Route path="/menus/:menuName/articles" component={ArticleListWrapper}/>
                <Route path="/articles/create" component={CreateArticle}/>
            </main>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MainArea);