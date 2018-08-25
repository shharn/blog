//@flow
import React from 'react';
import { connect } from 'react-redux';
import { reduxProviderTemplate, dispatchProviderTemplate } from './provider';

export const makeInfiniteScrollable = options => WrappedComponent => {
    class InfiniteScrollable extends React.Component{
        constructor(props) {
            super(props);
            this.handleScroll = this.handleScroll.bind(this);
            this.handleEndOfScroll = this.handleEndOfScroll.bind(this);
            this.isEndOfScroll = this.isEndOfScroll.bind(this);
            this.load = this.load.bind(this);
            this.initLoader = this.initLoader.bind(this);
            this.countPerRequest = options.countPerRequest || 5;
            this.initialCountPerRequest = options.initialCountPerRequest || this.countPerRequest;
            this.state = {
                relayedData: [],
                offset: options.offset || 0,
                hasMore: false
            };
        }

        componentDidMount() {
            this.load(this.initialCountPerRequest);
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            // The data fetch succeeded when the scroll is at the bottom of the container
            if (this.props.data.status === options.statusSuccess && this.props.data.relayed !== prevProps.data.relayed) {
                const addedData = this.props.data.relayed;
                if (addedData && addedData.length > 0) {
                    this.setState({
                        relayedData: this.state.relayedData.concat(addedData),
                        hasMore:  addedData.length >= this.countPerRequest,
                        offset: this.state.offset + addedData.length
                    });
                } else {
                    this.setState({
                        hasMore: false
                    });
                }
            }
        }

        handleScroll(e) : void {
            const target = e.target;
            if (this.isEndOfScroll(target)) {
                this.handleEndOfScroll();
            }
        }
    
        handleEndOfScroll() : void {
            const isFetching = this.props.data.status === options.statusWait;
            if (this.state.hasMore && !isFetching) {
                this.load(this.countPerRequest);
            }
        } 

        load(count: number) {
            const { loaderArgs } = options;
            const offset = this.state.offset;
            const args = loaderArgs && loaderArgs.call(this);
            this.props.loader(offset, count, args);
        }

        initLoader() {
            // initialize offset & relayedData
            this.setState({
                offset: 0,
                relayedData: []
            }, () => this.load(this.initialCountPerRequest));
        }
    
        isEndOfScroll(target: HTMLElement) : boolean {
            const { offsetHeight, scrollTop, scrollHeight } = target;
            return offsetHeight + scrollTop >= scrollHeight;
        }

        render() : React.Node {
            const { data, ...rest } = this.props;
            const { relayedData } = this.state;
            return (
                <div onScroll={this.handleScroll}>
                    <WrappedComponent {...rest} data={relayedData} initLoader={this.initLoader}>
                        {this.props.data.status === options.statusWait && options.loading()}
                        {this.props.data.status === options.statusError && options.error(this.props.data.error)}
                    </WrappedComponent>
                </div>
            );
        }
    }

    const { loader, useRedux, dataProvider, statusProvider, errorProvider, reduxPropsProvider } = options;
    return useRedux ?
        connect(reduxProviderTemplate({ dataProvider, statusProvider, errorProvider, reduxPropsProvider }), dispatchProviderTemplate(loader))(InfiniteScrollable) :
        InfiniteScrollable;
}
