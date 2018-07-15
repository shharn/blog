import Component from './HottestArticleList';
import { makeInfiniteScrollable } from '../InfiniteScrollable';
import { 
    requestDataWithURL
} from '../../action/data';

const infScrOptions = {
    countPerRequest: 5,
    reduxProvider: (state, ownProps) => {
        const { data, error, fetchStatus, fetchComplete } = state.app.data.get.hottestArticles
        return {
            articles: data,
            error,
            fetchStatus,
            fetchComplete,
            ...ownProps
        };
    },
    // need to additional processing for appending new data to old data
    // create new reducer & action for it
    loader: (offset, count) => {
        return requestDataWithURL('hottestArticles', `/articles/hottest?offset=${offset}&count=${count}`)
    },
    relayedDataName: 'articles',
    useRedux: true,
}

export default makeInfiniteScrollable(infScrOptions)(Component);
