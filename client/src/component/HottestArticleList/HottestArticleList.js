import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Card, { CardMedia, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Article from './Article';
import { FetchStatus } from '../../constant';
import { withStyles } from 'material-ui/styles';
import styles from './styles';
import { Paper } from 'material-ui';

type Props = {
    classes: any,
    path: string,

    articles: Array<Article>,
    error: any,
    fetchStatus: $Values<FetchStatus>,
    fetchComplete: boolean,

    getTheHottestArticles: (void) => void
}

class HottestArticleList extends Component<Props> {
    componentDidMount() {
        this.props.getTheHottestArticles();
    }

    getRightElementsOnFetchStatus() {
        const {  fetchStatus, articles, classes } = this.props;
        switch(fetchStatus) {
            case FetchStatus.FETCH_INITIAL:
            case FetchStatus.FETCH_WAIT:
                return <CircularProgress size={40}/>
            case FetchStatus.FETCH_SUCCESS:
                return (
                    articles.length > 0 ? 
                        <React.Fragment>
                            <Article classes={{ root: classes.firstCard, media: classes.largeMedia}} article={articles[0]}/>
                            <div className={classes.remainingRoot}>
                                {articles.slice(1).map(article => <Article key={`hottestArticle:${article.uid}`} classes={{ root: classes.card, media: classes.smallMedia }} article={article}/>)}
                            </div>
                        </React.Fragment> :
                        <span>Empty</span>
                );
            case FetchStatus.FETCH_FAIL:
            default:
                return <Typography className={this.props.classes.header}  variant="subheading">Fail to load Articles. :(</Typography>
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                {this.getRightElementsOnFetchStatus()}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(HottestArticleList);