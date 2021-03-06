// @flow
import React from 'react';
import Component from './ArticleList';
import { FetchStatus } from '../../constant';
import { makeInfiniteScrollable } from '../InfiniteScrollable';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { PLACEHOLDER_NAME_TO_CONVERT } from '../../constant';
import { requestDataWithNameAndURL } from '../../action/data';
import type { State } from '../../flowtype';
import type { InfiniteScrollableOptions } from '../InfiniteScrollable';

const infScrOptions: InfiniteScrollableOptions = {
    initialCountPerRequest: 10,
    countPerRequest: 5,
    dataProvider: (state: State) => state.app.data.get.articles.data,
    statusProvider: (state: State) => state.app.data.get.articles.fetchStatus,
    errorProvider: (state: State) => state.app.data.get.articles.error,
    reduxPropsProvider: (state: State) => ({
        fetchStatus: state.app.data.get.articles.fetchStatus
    }),
    statusWait: FetchStatus.WAIT,
    statusSuccess: FetchStatus.SUCCESS,
    statusFail: FetchStatus.FAIL,
    error: () => <Typography variant="subtitle2">Fail to load Articles. :(</Typography>, 
    loader: (offset: number, count: number, args?: Array<any>): void => {
        if (args && args.length > 0) {
            return requestDataWithNameAndURL(args[0], `articles`, 'name', `/menus/${PLACEHOLDER_NAME_TO_CONVERT}/articles?offset=${offset}&count=${count}`);
        }
        throw new Error('Empty arguments passed to InfiniteScrollable.loader method.');
    },
    loaderArgs: function() {
        return this.props.match.params["menuName"];
    },
    loading: () => <LinearProgress size={30} />,
    useRedux: true
}

export default makeInfiniteScrollable(infScrOptions)(Component);