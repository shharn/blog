// @flow
import * as React from 'react';
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

class ArticleList extends React.Component<RouterProps & WithStylesProps & InfiniteScrollabledProps, State> {
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
    }

    isMenuChanged = (): boolean => {
        return this.props.match.params['menuName'] !== this.state.prevMenuName
    }

    render = () => {
        const { classes, reduxProps } = this.props;
        const menuName = decodeURIComponent(this.props.match.params['menuName']);
        const articles = this.props.data;
        const isEmpty =  (reduxProps && reduxProps.fetchStatus === FetchStatus.SUCCESS) &&
            (!articles || articles.length < 1);
        return (
            <React.Fragment>
                <Typography className={classes.header} variant='h5'>{menuName}</Typography>
                <div className={classes.listContainer}>
                    {isEmpty ? 
                        <Typography 
                            className={classes.emptyText} 
                            align="center"
                            variant="h3">
                            Coming Soon  :)
                        </Typography> :
                        articles.map(article => 
                            <Article 
                                key={`article:${article.uid}`} 
                                article={article} 
                                customClasses={{ 
                                    root: classes.article, 
                                    cardImage: classes.articleImage,
                                    cardContent: classes.articleContent
                                 }}/>)
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleList);