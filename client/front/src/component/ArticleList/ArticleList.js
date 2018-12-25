// @flow
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Article from '../Article';
import { withStyles } from '@material-ui/core/styles';
import { FetchStatus } from '../../constant';
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

    componentDidMount() {
        document.title = `Puppyloper's blog`;
    }

    componentDidUpdate = () => {
        if (this.isMenuChanged()) {
            this.props.initLoader();
            this.setState({
                prevMenuName: this.props.match.params['menuName']
            });
        }

        if (this.props.data.length === 1) {
            this.moveToOnlyOneArticle();
        }
    }

    isMenuChanged = (): boolean => {
        return this.props.match.params['menuName'] !== this.state.prevMenuName
    }

    moveToOnlyOneArticle = (): void => {
        const article = this.props.data[0];
        const replacedTitle = encodeURIComponent(article.title);
        this.props.history.push(`${this.props.location.pathname}/${replacedTitle}`)
    }

    render = () => {
        const { classes, reduxProps } = this.props;
        const articles = this.props.data;
        const isEmpty =  (reduxProps && reduxProps.fetchStatus === FetchStatus.SUCCESS) &&
            (!articles || articles.length < 1);
        return (
            <div className={classes.listContainer}>
                {isEmpty ? 
                    <Typography 
                        className={classes.emptyText} 
                        align="center"
                        variant="display2">
                        Coming Soon  :)
                    </Typography> :
                    articles.map(article => 
                        <Article 
                            key={`article:${article.uid}`} 
                            article={article} 
                            customClasses={{ root: classes.article, cardMedia: classes.articleImage }}/>)
                }
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleList);