//@flow
import React from 'react';
import { connect } from 'react-redux';

export const makeInfiniteScrollable = options => WrappedComponent => {
    class InfiniteScrollable extends React.Component{
        constructor(props) {
            super(props);
            const { countPerRequest, offset } = options;
            this.handleScroll = this.handleScroll.bind(this);
            this.handleEndOfScroll = this.handleEndOfScroll.bind(this);
            this.isEndOfScroll = this.isEndOfScroll.bind(this);
            this.load = this.load.bind(this);
            this.hasMore = true;
            this.countPerRequest = countPerRequest || 5;
            this.state = {
                offset: offset || 0,
                numberOfPrevData: 0
            };
            this.internalStorage = { relayedData: [] };
        }

        componentDidMount() {
            this.load();
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            const { relayedDataName } = options;
            let { relayedData } = this.internalStorage;
            const addedData = this.props[relayedDataName];
            if (addedData && addedData.length > 0) {
                this.internalStorage.relayedData = relayedData.concat(addedData);
                this.hasMore = true;
            } else {
                console.log('no more data');
                this.hasMore = false;
            }
        }

        // stop watching the event during fetching the new data
        // after fetching complete, resume the listening
        handleScroll(e) : void {
            const target = e.target;
            if (this.isEndOfScroll(target)) {
                this.handleEndOfScroll();
            }
        }
    
        handleEndOfScroll() : void {
            console.log('[handleEndOfScroll] hasMore : ' + this.hasMore);
            if (this.hasMore) {
                this.load();
            }
        } 

        load() {
            const countPerRequest = this.countPerRequest;
            const { offset } = this.state;
            this.props.loader(offset, countPerRequest);
            // offset = offset + number of added data
            // should fix !!
            this.setState({
                offset: offset + countPerRequest
            });
        }
    
        isEndOfScroll(target: HTMLElement) : boolean {
            const { offsetHeight, scrollTop, scrollHeight } = target;
            return offsetHeight + scrollTop >= scrollHeight;
        }

        render() : React.Node {
            const { relayedDataName } = options;
            const {[relayedDataName]: data, ...rest } = this.props;
            return (
                <div onScroll={this.handleScroll}>
                    <WrappedComponent {...rest} data={data}/>
                </div>
            );
        }
    }

    const { loader, useRedux } = options;
    if (useRedux) {
        const mdtp = dispatch => {
            return {
                loader: (offset, count) => dispatch(loader(offset, count))
            };
        };
        return connect(options.reduxProvider, mdtp)(InfiniteScrollable)
    } else {
        return InfiniteScrollable;
    }
}

// const provider = innerStorage => {
    // some processing
    // and ...
    // return the reesult
//}