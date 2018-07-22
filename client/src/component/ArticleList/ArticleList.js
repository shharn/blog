import React, { Component } from 'react';
import Article from '../Article';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

type Props = {
    classes: any,
    path: string,

    getArticlesOnMenu: (menuId: number) => void
}

class ArticleList extends Component<Props> {
    render() {
        const { classes } = this.props;
        const articles = this.props.data
        return (
            <div className={classes.listContainer}>
                {articles.map(article => <Article key={`article:${article.uid}`} article={article} customClasses={{ root: classes.article, cardMedia: classes.articleImage }}/>)}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleList);