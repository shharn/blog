// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FetchStatus } from '../../constant';
import Article from '../Article';
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
        const { classes } = this.props;
        const articles = this.props.data;
        return (
            <div className={classes.container}>
                {articles.length > 0 ? 
                    <React.Fragment>
                        <Article customClasses={{ root: classes.firstCard, cardMedia: classes.largeMedia}} article={articles[0]}/>
                        <div className={classes.remainingRoot} ref={container => this.innerContainer = container}>
                            {articles.slice(1).map(article => <Article key={`hottestArticle:${article.uid}`} customClasses={{ root: classes.card, cardMedia: classes.smallMedia }} article={article}/>)}
                        </div>
                        {this.props.children}
                    </React.Fragment> :
                    <span>Empty !!</span>
                }
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(HottestArticleList);