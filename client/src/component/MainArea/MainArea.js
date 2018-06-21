// @flow
import React, { Component } from 'react';
import { getDataWithURL } from '../../action/data';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

import type { FetchStatus } from '../../constant';

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
    
    articles: Array<Article>,
    error: any,
    fetchStatus: $Values<FetchStatus>,
    fetchComplete: boolean,

    getTheHottestArticles: () => void,
    getArticlesOnMenu: (menuId: number) => void
}

class MainArea extends Component<Props> {
    componentDidMount() {
        const { path } = this.props;
        const isHome = path.length < 2;
        if (isHome) {
            this.props.getTheHottestArticles();
        } else {
            const menuId = path.split('/')[2];
            this.props.getArticlesOnMenu(menuId);
        }
    }

    render() {
        const { classes, path } = this.props;
        const isHome = path.length < 2;
        const menuId = path.split('/')[2];
        return (
            <main className={classes.content}>
                {isHome ? "This is home" : "Should show list of articles on a menu" + menuId}
            </main>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MainArea);