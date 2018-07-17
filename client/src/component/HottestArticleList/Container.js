import React from 'react';
import Component from './HottestArticleList';
import { FetchStatus } from '../../constant';
import { makeInfiniteScrollable } from '../InfiniteScrollable';
import CircularProgress from '@material-ui/core/CircularProgress';
import { 
    requestDataWithURL
} from '../../action/data';

const infScrOptions = {
    countPerRequest: 5,
    dataProvider: state => state.app.data.get.hottestArticles.data,
    statusProvider: state => state.app.data.get.hottestArticles.fetchStatus,
    errorProvider: (state, ownProps) => state.app.data.get.hottestArticles.error,
    statusWait: FetchStatus.WAIT,
    statusSuccess: FetchStatus.SUCCESS,
    statusFail: FetchStatus.FAIL,
    error: () => {}, // react component or function that returns react component
    loader: (offset, count) => requestDataWithURL('hottestArticles', `/articles/hottest?offset=${offset}&count=${count}`),
    loading: () => <CircularProgress size={30} />,
    useRedux: true
}

export default makeInfiniteScrollable(infScrOptions)(Component);
