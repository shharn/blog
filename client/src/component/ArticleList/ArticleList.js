import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Article from '../Article';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

type Props = {
    classes: any,
    path: string,

    getArticlesOnMenu: (menuId: number) => void
}

class ArticleList extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            prevMenuName: this.props.match.params['menuName']
        };
    }

    componentDidUpdate() {
        if (this.props.match.params['menuName'] !== this.state.prevMenuName) {
            this.props.initLoader();
            this.setState({
                prevMenuName: this.props.match.params['menuName']
            });
        }
    }

    render() {
        const { classes } = this.props;
        const articles = this.props.data;
        const isEmpty = !articles || articles.length < 1;
        return (
            <div className={classes.listContainer}>
                {isEmpty ? 
                    <Typography className={classes.emptyText} variant='display2'>Coming Soon  :)</Typography> :
                    articles.map(article => <Article key={`article:${article.uid}`} article={article} customClasses={{ root: classes.article, cardMedia: classes.articleImage }}/>)}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleList);