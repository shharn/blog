// @flow
import React, { Component } from 'react';
import { Route } from 'react-router';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import Loadable from 'react-loadable';
import styles from './styles';

const HottestArticleList = Loadable({
    loader: () => import('../HottestArticleList'),
    loading: () => <CircularProgress size={30}/>
  });
  
  const ArticleList  = Loadable({
    loader: () => import('../ArticleList'),
    loading: () => <CircularProgress size={30}/>
  });

type Article = {
    uid?: string,
    title: string,
    content: string,
    summary: string,
    createdAt: string,
    views: number,
    menu: ?Menu
}

type Props = {
    classes: any,
    path: string,
}

class MainArea extends Component<Props> {
    // componentDidMount() {
    //     const { path } = this.props;
    //     const isHome = path.length < 2;
    //     const menuId = path.split('/')[2];
    //     isHome ? this.props.getTheHottestArticles() : this.props.getArticlesOnMenu(menuId);
    // }

    render() {
        const { classes, articles, fetchComplete, fetchStatus, path } = this.props;
        const isHome = path.length < 2;
        // const isHome = path.length < 2;
        return (
            <main className={classes.content}>
                <Route exact path="/" component={HottestArticleList}/>
                <Route path="/menus/:id/articles" component={ArticleList}/>
                {/* {isHome ?  */}
                {/* {fetchComplete ? 
                    FetchStatusType : 
                    <CircularProgress size={30}/> */}
            </main>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MainArea);