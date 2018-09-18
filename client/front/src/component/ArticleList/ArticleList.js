// @flow
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Article from '../Article';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import type { 
    RouterProps,
    WithStylesProps
} from '../../flowtype';
import type { InfiniteScrollabledProps } from '../InfiniteScrollable';

type State = {
    prevMenuName: string
};

class ArticleList extends Component<RouterProps & WithStylesProps & InfiniteScrollabledProps, State> {
    state = {
            prevMenuName: this.props.match.params['menuName']
    };

    componentDidUpdate = () => {
        if (this.props.match.params['menuName'] !== this.state.prevMenuName) {
            this.props.initLoader();
            this.setState({
                prevMenuName: this.props.match.params['menuName']
            });
        }

        if (this.props.data.length === 1) {
            const article = this.props.data[0];
            const replacedTitle = article.title.toLowerCase().replace(/\s/g, '-');
            this.props.history.push(`${this.props.location.pathname}/${replacedTitle}`)
        }
    }

    render = () => {
        const { classes } = this.props;
        const articles = this.props.data;
        const isEmpty = !articles || articles.length < 1;
        return (
            <div className={classes.listContainer}>
                {isEmpty ? 
                    <Typography className={classes.emptyText} variant='display2'>Coming Soon  :)</Typography> :
                    articles.map(article => <Article key={`article:${article.uid}`} article={article} customClasses={{ root: classes.article, cardMedia: classes.articleImage }}/>)}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleList);