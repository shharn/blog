import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MetaInfo from '../MetaInfo';
import ArticleDetailContent from '../ArticleDetailContent';
import ButtonGroup from '../ArticleDetailButtonGroup';
import { FetchStatus } from '../../constant';
import CircularProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class ArticleDetail extends Component {
    componentDidMount() {
        const articleName = this.props.match.params['articleName']
        this.props.getArticle(articleName);
    }

    componentDidUpdate() {
        if (!this.props.article) {
            let url = this.getParentURL(this.props.location.pathname);
            this.props.history.push(url);
        }
    }

    getParentURL(currPath) {
        let idx = currPath.lastIndexOf('/');
        let url = currPath.substring(0, idx);
        return url;
    }

    render() {
        const { classes, article, fetchStatus, isAuthenticated } = this.props;
        return (
            article ? 
                fetchStatus === FetchStatus.WAIT || fetchStatus === FetchStatus.INITIAL ?
                    <CircularProgress size={30}/> :
                    <Paper elevation={4} className={classes.container}>
                        {fetchStatus === FetchStatus.FAIL ?
                            <Typography variant="subheading">Temporarily not available :(</Typography> :
                            <React.Fragment>
                                <Typography className={classes.title} variant="display1">{article.title}</Typography>
                                <MetaInfo createdAt={article.createdAt}/>
                                <ArticleDetailContent content={article.content || ''}/>
                            </React.Fragment>}
                            <Divider className={classes.divider}/>
                            <ButtonGroup isAuthenticated={isAuthenticated} parentURL={this.getParentURL(this.props.location.pathname)}/>
                    </Paper> :
                <Typography className={classes.noArticleText} variant="display1">No Article Found</Typography>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ArticleDetail);