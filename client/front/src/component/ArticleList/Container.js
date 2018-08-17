import React from 'react';
import Component from './ArticleList';
import { FetchStatus } from '../../constant';
import { makeInfiniteScrollable } from '../InfiniteScrollable';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { PLACEHOLDER_NAME_TO_CONVERT } from '../../constant';
import { 
    requestDataWithNameAndURL
} from '../../action/data';

const infScrOptions = {
    countPerRequest: 5,
    dataProvider: state => state.app.data.get.articles.data,
    statusProvider: state => state.app.data.get.articles.fetchStatus,
    errorProvider: state => state.app.data.get.articles.error,
    statusWait: FetchStatus.WAIT,
    statusSuccess: FetchStatus.SUCCESS,
    statusFail: FetchStatus.FAIL,
    error: error => <Typography variant="subheading">Fail to load Articles. :(</Typography>, 
    loader: (offset, count, args) => requestDataWithNameAndURL(args[0], `articles`, 'name', `/menus/${PLACEHOLDER_NAME_TO_CONVERT}/articles?offset=${offset}&count=${count}`),
    loaderArgs: function() {
        return this.props.match.params["menuName"];
    },
    loading: () => <LinearProgress />,
    useRedux: true
}

export default makeInfiniteScrollable(infScrOptions)(Component);