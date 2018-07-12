import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { makeInfiniteScrollable } from '../InfiniteScrollable';
import { FetchStatus } from '../../constant';
import { 
    requestDataWithURL
} from '../../action/data';
import Article from './Article';
import styles from './styles';

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
    // componentDidMount() {
    //     this.props.getTheHottestArticles();
    // }

    getRightElementsOnFetchStatus() {
        const {  fetchStatus, articles } = this.props;
        const { classes } = this.props;
        switch(fetchStatus) {
            case FetchStatus.FETCH_INITIAL:
            case FetchStatus.FETCH_WAIT:
                return <CircularProgress size={40}/>
            case FetchStatus.FETCH_SUCCESS:
                return (
                    articles.length > 0 ? 
                        <React.Fragment>
                            <Article classes={{ root: classes.firstCard, media: classes.largeMedia}} article={articles[0]}/>
                            <div className={classes.remainingRoot} ref={container => this.innerContainer = container}>
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

const infScrOptions = {
    countPerRequest: 5,
    reduxProvider: (state, ownProps) => {
        const { data, error, fetchStatus, fetchComplete } = state.app.data.get.hottestArticles
        return {
            articles: data,
            error,
            fetchStatus,
            fetchComplete,
            ...ownProps
        };
    },
    loader: (offset, count) => {
        console.log(`[loader] offset : ${offset}, count : ${count}`);
        return requestDataWithURL('hottestArticles', `/articles/hottest?offset=${offset}&count=${count}`)
    },
    useRedux: true,
}

export default withStyles(styles, { withTheme: true })(makeInfiniteScrollable(infScrOptions)(HottestArticleList));