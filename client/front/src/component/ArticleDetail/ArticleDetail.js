// @flow
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
import type { 
    Article,
    ClientError,
    RouterProps,
    WithStylesProps
} from '../../flowtype';

type Props = {
    article: Article,
    error: ClientError,
    fetchStatus: $Values<FetchStatus>,
    isAuthenticated: boolean,
    deleteFetchStatus: $Values<FetchStatus>,
    isServerRendered: boolean,

    getArticle: (articleName: string) => void,
    deleteArticle: (uid: string) => void,
    initDeleteFetchStatus: () => void,
    setArticleToEdit: (article : Article) => void,
    initServerRenderingFlag: () => void
};

type StaticProps = {
    parentURL: string
};

class ArticleDetail extends Component<Props & RouterProps & WithStylesProps, {}, StaticProps> {
    componentDidMount = () => {
        if (!this.props.isServerRendered) {
            const articleName = this.props.match.params['articleName']
            this.props.getArticle(articleName);
            document.title = this.props.article.title;
        } else {
            this.props.initServerRenderingFlag();
        }
    }

    componentDidUpdate = () => {
        if (!this.props.article || this.props.deleteFetchStatus === FetchStatus.SUCCESS) {
            let url = this.getParentURL(this.props.location.pathname);
            this.props.initDeleteFetchStatus();
            this.props.history.push(url);
        }
        document.title = this.props.article.title;
    }

    getParentURL = (currPath: string): string => {
        if (this.parentURL) 
            return this.parentURL;

        let idx = currPath.lastIndexOf('/');
        this.parentURL = currPath.substring(0, idx);
        return this.parentURL;
    }

    onDeleteButtonClicked = (): void =>  {
        this.props.deleteArticle(this.props.article.uid);
    }

    onEditButtonClicked = (): void => {
        this.props.setArticleToEdit(this.props.article);
        this.props.history.push(`/admin/article?prevURL=${encodeURI(this.props.location.pathname)}`);
    }

    render = () => {
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
                            <ButtonGroup 
                                isAuthenticated={isAuthenticated} 
                                parentURL={this.getParentURL(this.props.location.pathname)}
                                onEditButtonClicked={this.onEditButtonClicked}
                                onDeleteButtonClicked={this.onDeleteButtonClicked}
                            />
                    </Paper> :
                <Typography className={classes.noArticleText} variant="display1">No Article Found</Typography>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ArticleDetail);