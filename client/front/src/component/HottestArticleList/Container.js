import React from 'react';
import Component from './HottestArticleList';
import { FetchStatus } from '../../constant';
import { makeInfiniteScrollable } from '../InfiniteScrollable';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { 
    requestDataWithURL
} from '../../action/data';

const infScrOptions = {
    initialCountPerRequest: 10,
    countPerRequest: 5,
    dataProvider: state => state.app.data.get.hottestArticles.data,
    statusProvider: state => state.app.data.get.hottestArticles.fetchStatus,
    errorProvider: state => state.app.data.get.hottestArticles.error,
    statusWait: FetchStatus.WAIT,
    statusSuccess: FetchStatus.SUCCESS,
    statusFail: FetchStatus.FAIL,
    error: error => <Typography variant="subheading">Fail to load Articles. :(</Typography>, 
    loader: (offset, count) => requestDataWithURL('hottestArticles', `/articles/hottest?offset=${offset}&count=${count}`),
    loading: () => <LinearProgress />,
    useRedux: true
}

export default makeInfiniteScrollable(infScrOptions)(Component);
