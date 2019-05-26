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
        const isFetched = reduxProps && reduxProps.fetchStatus === FetchStatus.SUCCESS;
        const isEmpty = !(articles && articles.length);
        return (
            <div className={classes.container}>
                <NoSsr>
                    <Typography 
                        className={classes.header} 
                        variant='h5'>
                        Newest
                    </Typography>
                </NoSsr>
                {isFetched && isEmpty &&
                    <Typography 
                        className={classes.emptyMessage}
                        align="center"
                        variant='h3'>
                        Coming Soon  :)
                    </Typography>
                }
                {!isEmpty &&
                    <div className={classes.listContainer}>
                        <Article
                            customClasses={{
                                root: classes.firstCard,
                                cardImage: classes.firstCardImage,
                                cardContent: classes.firstCardContent
                            }}
                            article={articles[0]}/>
                        {articles.slice(1).map(article => (
                            <Article
                                key={`hottest-article-${article.uid}`}
                                customClasses={{
                                    root: classes.card,
                                    cardImage: classes.cardImage,
                                    cardContent: classes.cardContent
                                }}
                                article={article}
                            />
                        ))}
                    </div>
                }
                {this.props.children}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(HottestArticleList);