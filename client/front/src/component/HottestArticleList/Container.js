// @flow
import React from 'react';
import Component from './HottestArticleList';
import { FetchStatus } from '../../constant';
import { makeInfiniteScrollable } from '../InfiniteScrollable';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { requestDataWithURL } from '../../action/data';
import type { State } from '../../flowtype';
import type { InfiniteScrollableOptions } from '../InfiniteScrollable';

const infScrOptions: InfiniteScrollableOptions = {
    initialCountPerRequest: 10,
    countPerRequest: 5,
    dataProvider: (state: State): mixed => state.app.data.get.hottestArticles.data,
    statusProvider: (state: State): mixed => state.app.data.get.hottestArticles.fetchStatus,
    errorProvider: (state: State):mixed => state.app.data.get.hottestArticles.error,
    reduxPropsProvider: (state: State): mixed => ({
        fetchStatus: state.app.data.get.hottestArticles.fetchStats
    }),
    statusWait: FetchStatus.WAIT,
    statusSuccess: FetchStatus.SUCCESS,
    statusFail: FetchStatus.FAIL,
    error: () => <Typography variant="subtitle2">Fail to load Articles. :(</Typography>, 
    loader: (offset: number, count: number) => requestDataWithURL('hottestArticles', `/articles/hottest?offset=${offset}&count=${count}`),
    loading: () => <LinearProgress />,
    useRedux: true
}

export default makeInfiniteScrollable(infScrOptions)(Component);
