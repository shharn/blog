import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { FetchStatus } from '../../constant';
import Article from './Article';
import styles from './styles';

type Props = {
    classes: any,
    path: string,

    articles: Array<Article>,
    error: any,
    fetchStatus: $Values<FetchStatus>,
    fetchComplete: boolean,
}

class HottestArticleList extends Component<Props> {
    componentDidUpdate() {
    }

    getRightElementsOnFetchStatus() {
        const {  fetchStatus } = this.props;
        const articles = this.props.data;
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

export default withStyles(styles, { withTheme: true })(HottestArticleList);