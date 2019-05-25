// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import CardImage from './CardImage';
import CardContent from './CardContent';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import styles from './styles';

import type { 
    WithStylesProps,
    Article as ArticleEntity
 } from '../../flowtype';

type Props = {
    article: ArticleEntity,
    customClasses: {
        root: string,
        cardImage: string,
        cardContent: string
    },

    setArticle: (article: ArticleEntity) => void
};

class Article extends Component<Props & WithStylesProps> {
    onCardClick = () => {
        const { article, setArticle } = this.props;
        setArticle(article);
        const encodedMenuName = encodeURIComponent(article.menu[0].name);
        const encodedArticleName = encodeURIComponent(article.title);
        this.props.history.push(`/menus/${encodedMenuName}/articles/${encodedArticleName}`);
    }

    render = () => {
        const { article, classes, customClasses } = this.props;
        return (
            <Paper className={cn(classes.root, customClasses.root)} elevation={4} onClick={this.onCardClick}>
                <CardImage containerClass={customClasses.cardImage} imageSource={article.imageSource} alt={article.title}/>
                <CardContent title={article.title} containerClass={customClasses.cardContent} summary={article.summary} />
            </Paper>
        );
    }
}

export default withRouter(withStyles(styles.root)(Article));