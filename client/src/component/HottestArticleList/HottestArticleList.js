import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import { Typography } from 'material-ui';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
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
                    // must be responsive later (> xm, <= xm)
                    <GridList cellHeight={200} spacing={2} className={classes.gridList}>
                        {articles.map((article, index) => (
                            <GridListTile key={article.uid} cols={index === 0 ? 2 : 1} rows={index === 0 ? 2 : 1}>
                                <img src={article.imageSource} alt={article.title}/>
                                <GridListTileBar title={article.title} titlePosition="bottom" actionIcon={
                                    <IconButton className={classes.gridListTitleIcon}>
                                        <StarBorderIcon />
                                    </IconButton>
                                } actionPosition="left" className={classes.titleBar}/>
                            </GridListTile>
                        ))}
                    </GridList>
                );
            case FetchStatus.FETCH_FAIL:
            default:
                return <Typography className={this.props.classes.header}  variant="subheading">Fail to load Articles. :(</Typography>
        }
    }

    render() {
        return (
            <div>
                {this.getRightElementsOnFetchStatus()}
            </div>
        );
    }
}

export default withStyles(styles)(HottestArticleList);