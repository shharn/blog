import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Card, { CardMedia, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
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
                    articles.map((article, index) => (
                        <Card key={`hottestArticle:${article.uid}`} className={index === 0 ? classes.cardFirst : classes.card}>
                            <CardMedia className={index === 0 ? classes.cardMediaFirst : classes.cardMedia} image={article.imageSource} title={article.title}/>
                            <CardContent>
                                <Typography gutterBottom variant="headline" component="h2">
                                    {article.title}
                                </Typography>
                                <Typography component="p">
                                    {article.summary}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
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