// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router';
import PrivateRoute from '../PrivateRoute';
import CenteredCircularProgress from '../CenteredCircularProgress';
import Loadable from 'react-loadable';
import styles from './styles';
import type { WithStylesProps } from '../../flowtype';

const HottestArticleList = Loadable({
    loader: () =>  import('../HottestArticleList'),
    loading: () => <CenteredCircularProgress />
  });
  
const ArticleListWrapper  = Loadable({
    loader: () => import(/* webpackPrefetch: true */ '../ArticleListWrapper'),
    loading: () => <CenteredCircularProgress />
});

const CreateArticle = Loadable({
    loader: () => import('../CreateOrEditArticle'),
    loading: () => <CenteredCircularProgress />
});

const ArticleDetail = Loadable({
    loader: () => import('../ArticleDetail'),
    loading: () => <CenteredCircularProgress />
});

class MainArea extends Component<WithStylesProps> {
    render = () => {
        const { classes } = this.props;
        return (
            <main className={classes.content}>
                <Switch>
                    <Route exact path="/" component={HottestArticleList}/>
                    <Route exact path="/menus/:menuName/articles" component={ArticleListWrapper}/>
                    <Route exact path="/menus/:menuName/articles/:articleName" component={ArticleDetail}/>
                    <PrivateRoute path="/admin/article" component={CreateArticle}/>
                </Switch>
            </main>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MainArea);