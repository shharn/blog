import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import InfiniteScrollable from '../InfiniteScrollable';
import Typography from 'material-ui/Typography';
import Article from './Article';
import { FetchStatus } from '../../constant';
import { withStyles } from 'material-ui/styles';
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
    constructor(props) {
        super(props);
        this.state = {
            height: 0
        };
    }

    componentDidMount() {
        this.props.getTheHottestArticles();
    }

    componentDidUpdate() {
        console.log('height : ' + this.containerElement.offsetHeight);
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
                                {/* <InfiniteScrollable

                                >
                                    {articles.slice(1).map(article => <Article key={`hottestArticle:${article.uid}`} classes={{ root: classes.card, media: classes.smallMedia }} article={article}/>)}
                                </InfiniteScrollable> */}
                                {/* <InfiniteScrollable hasMore={() => } */}
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
            <div className={classes.container} ref={container => this.containerElement = container}>
                {this.getRightElementsOnFetchStatus()}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(HottestArticleList);