//@flow
import React, { Component, SyntheticEvent } from 'react';

type Props = {
    target: React.Node,
    countPerRequest: number,
    initialData: any,
    className: string,
    status: number | string,
    compMaker: (data : any) => React.Component,
    loading: () => React.Component,
    loader: (offset: number, count: number) => void
};

type State = {
    offset: number,
}

class InfiniteScrollable extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            prevCount: 0,
            currentCount: this.props.initialData ? this.props.initialData.length : 0
        };
        this.props.target.current.addEventListener('scroll', this.handleScroll);
    }

    componentDidMount() {
        if (!this.props.initialData) {
            this.props.loader();
        }
    }

    handleScroll() : void {
        console.log(`offsetHeight(${this.props.target.offsetHeight}) + scrollTop(${this.props.target.offsetHeight}) = scrollHeight(${this.props.target.scrollHeight})`);
        if (this.isEndOfScroll()) {
            this.handleEndOfScroll();
        }
    }

    handleEndOfScroll() : void {
        const { loader } = this.props;
        if (this.hasMore()) {
            loader();
        }
    }

    isEndOfScroll() : boolean {
        const { target } = this.props;
        const { offsetHeight, scrollTop, scrollHeight } = target;
        return offsetHeight + scrollTop >= scrollHeight;
    }

    hasMore() : boolean {
        const { countPerRequest } = this.props;
        const { prevCount, currentCount } = this.state;
        return prevCount + countPerRequest <= currentCount;
    }

    render() : React.Node {
        const { className, loading, compMaker, status, data } = this.props;
        return (
            <div className={className} onScroll={this.handleScroll}>
                {status === 'FETCHING' ?
                     <loading />:
                     (status === 'COMPLETE' ?
                        compMaker(data) : 'Error Occured')
                }
            </div>
        );
    }
}

export default InfiniteScrollable;