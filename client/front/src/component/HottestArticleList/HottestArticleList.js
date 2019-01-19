// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FetchStatus } from '../../constant';
import Article from '../Article';
import NoSsr from '@material-ui/core/NoSsr';
import { Typography } from '@material-ui/core';
import styles from './styles';
import type {
    WithStylesProps,
    RouterProps,
    Article as ArticleEntity,
    ClientError
} from '../../flowtype';

type Props = {
    articles: Array<ArticleEntity>,
    error: ClientError,
    fetchStatus: $Values<FetchStatus>,
    fetchComplete: boolean,
}

class HottestArticleList extends React.Component<Props & WithStylesProps & RouterProps> {
    innerContainer: ?HTMLDivElement;

    render = () => {
        const { classes, reduxProps } = this.props;
        const articles = this.props.data;
        const isEmpty = (reduxProps && reduxProps.fetchStatus === FetchStatus.SUCCESS) &&
            (articles && articles.length);
        return (
            <div className={classes.container}>
                <NoSsr>
                    <Typography 
                        className={classes.header} 
                        variant='h5'>
                        Newest
                    </Typography>
                </NoSsr>
                {articles.length > 0 ? 
                    <React.Fragment>
                        <Article 
                            customClasses={{ 
                                root: classes.firstCard, 
                                cardMedia: classes.largeMedia
                            }} 
                            article={articles[0]}/>
                        <div 
                            className={classes.remainingRoot} 
                            ref={container => this.innerContainer = container}>
                            {articles.slice(1).map(article => (
                                <Article 
                                    key={`hottestArticle:${article.uid}`} 
                                    customClasses={{ 
                                        root: classes.card, 
                                        cardMedia: classes.smallMedia 
                                    }} 
                                    article={article}/>
                                )
                            )}
                        </div>
                        {this.props.children}
                    </React.Fragment> :
                    isEmpty &&
                        <Typography 
                            className={classes.emptyMessage}
                            align="center"
                            variant='h3'>
                            Coming Soon  :)
                        </Typography>
                }
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(HottestArticleList);