// @flow
import React, { Component } from 'react';
import Card  from '@material-ui/core/Card';
import CardMedia from  '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import cn from 'classnames';
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
        cardMedia: string
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
            <Card 
                className={cn(customClasses.root, classes.card)}
                onClick={this.onCardClick}>
                <CardHeader 
                    title={article.title} 
                    subheader={article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' }) : 'May be, 2018'}/>
                <CardMedia className={customClasses.cardMedia} 
                    image={article.imageSource}
                    title={article.title}/>
                <CardContent>
                    <Typography variant='body1'>
                        {article.summary.length > 200 ? article.summary.substr(0, 200) + ' ... ' : article.summary}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withRouter(withStyles(styles, { withTheme: true })(Article));