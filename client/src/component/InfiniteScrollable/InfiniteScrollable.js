//@flow
import React, { Component, SyntheticEvent } from 'react';

type Props = {
    className: string,
    hasMore: () => boolean,
    status: number | string,
    compMaker: (data : any) => React.Component,
    loading: () => React.Component,
    load: () => void
};

class InfiniteScrollable extends Component<Props> {
    handleScroll(e: SyntheticEvent) {
        console.dir(e);
        if (this.isEndOfScroll()) {

        }
    }

    handleEndOfScroll() {
        const { hasMore, load } = this.props;
        if (hasMore()) {
            load();
        }
    }

    isEndOfScroll() {
        return false;
    }

    render() {
        const { className, loading, compMaker, status, data } = this.props;
        return (
            <div className={className} onScroll={this.handleScroll}>
                {status === 'FETCHING' ?
                     loading() :
                     (status === 'COMPLETE' ?
                        compMaker(data) : 'Error Occured')
                }
            </div>
        );
    }
}

export default InfiniteScrollable;