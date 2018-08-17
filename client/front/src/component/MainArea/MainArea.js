// @flow
import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router';
import PrivateRoute from '../PrivateRoute';
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

const ArticleDetail = Loadable({
    loader: () => import('../ArticleDetail'),
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
                <Switch>
                    <Route exact path="/" component={HottestArticleList}/>
                    <Route exact path="/menus/:menuName/articles" component={ArticleListWrapper}/>
                    <Route path="/menus/:menuName/articles/:articleName" component={ArticleDetail}/>
                    <PrivateRoute path="/admin/article" component={CreateArticle}/>
                </Switch>
            </main>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MainArea);