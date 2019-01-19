// @flow
import React from 'react';
import Component from './ArticleList';
import { FetchStatus } from '../../constant';
import { makeInfiniteScrollable } from '../InfiniteScrollable';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { PLACEHOLDER_NAME_TO_CONVERT } from '../../constant';
import { requestDataWithNameAndURL } from '../../action/data';
import type { StoreState } from '../../';
import type { InfiniteScrollableOptions } from '../InfiniteScrollable';

const infScrOptions: InfiniteScrollableOptions = {
    initialCountPerRequest: 10,
    countPerRequest: 5,
    dataProvider: (state: StoreState) => state.app.data.get.articles.data,
    statusProvider: (state: StoreState) => state.app.data.get.articles.fetchStatus,
    errorProvider: (state: StoreState) => state.app.data.get.articles.error,
    reduxPropsProvider: (state: StoreState) => ({
        fetchStatus: state.app.data.get.articles.fetchStatus
    }),
    statusWait: FetchStatus.WAIT,
    statusSuccess: FetchStatus.SUCCESS,
    statusFail: FetchStatus.FAIL,
    error: () => <Typography variant="subtitle2">Fail to load Articles. :(</Typography>, 
    loader: (offset: number, count: number, args?: Array<any>): void => {
        if (args && args.length > 0) {
            return requestDataWithNameAndURL(args[0], `articles`, 'name', `/menus/${PLACEHOLDER_NAME_TO_CONVERT}/articles?offset=${offset}&count=${count}`);
        } else {
            throw new Error(`Invalid arguments passed to InfiniteScrollable.loader method. arguments: ${JSON.stringify(args)}`);
        }
    },
    loaderArgs: function() {
        return this.props.match.params["menuName"];
    },
    loading: () => <LinearProgress size={30} />,
    useRedux: true
}

export default makeInfiniteScrollable(infScrOptions)(Component);