// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { reduxProviderTemplate, dispatchProviderTemplate } from './provider';

import type { Provider } from './provider';

export type InfiniteScrollabledProps = {
    data?: Array<mixed>,
    initLoader: () => void
};

export type InfiniteScrollableOptions = {
    offset?: number,
    initialCountPerRequest: number,
    countPerRequest: number,
    dataProvider: Provider,
    statusProvider: Provider,
    errorProvider: Provider,
    reduxPropsProvider?: Provider,
    statusWait: mixed, 
    statusSuccess: mixed,
    statusFail: mixed,
    error: (error: mixed) => React.Element<*>,
    loader: (offset: number, count: number, args?: Array<any>) => void,
    loaderArgs?: () => Object,
    loading: () => React.Element<*>,
    useRedux: boolean
}

type ReduxDataProps = {
    status: mixed,
    error: string,
    relayed: Array<mixed>
};

type WrapperProps = {
    data: ReduxDataProps,
    reduxProps?: any,
    loader: (offset: number, count: number, args?: Object) => void
}

type WrapperState = {
    offset: number,
    hasMore: boolean,
    relayedData: Array<mixed>
}

export const makeInfiniteScrollable = (options: InfiniteScrollableOptions) => (WrappedComponent: React.ComponentType<any>) => {
    class InfiniteScrollable extends React.Component<WrapperProps, WrapperState>{
        countPerRequest: number = options.countPerRequest;
        initialCountPerRequest: number = options.initialCountPerRequest;

        state = {
            relayedData: [],
            offset: options.offset || 0,
            hasMore: false
        };

        componentDidMount = (): void => {
            this.load(this.initialCountPerRequest);
        }

        componentDidUpdate = (prevProps: WrapperProps): void => {
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

        // (event: SyntheticEvent<HTMLButtonElement>) => {
        handleScroll = (e: SyntheticEvent<>): void => {
            const target =  e.target;
            if (this.isEndOfScroll(target)) {
                this.handleEndOfScroll();
            }
        }
    
        handleEndOfScroll = (): void => {
            const isFetching = this.props.data.status === options.statusWait;
            if (this.state.hasMore && !isFetching) {
                this.load(this.countPerRequest);
            }
        } 

        load = (count: number): void => {
            const { loaderArgs } = options;
            const { offset } = this.state;
            const args = loaderArgs && loaderArgs.call(this);
            this.props.loader(offset, count, args);
        }

        initLoader = (): void => {
            // initialize offset & relayedData
            this.setState({
                offset: 0,
                relayedData: []
            }, () => this.load(this.initialCountPerRequest));
        }
    
        isEndOfScroll = (target: any): boolean => {
            const { offsetHeight, scrollTop, scrollHeight } = target;
            return offsetHeight + scrollTop >= scrollHeight;
        }

        render() {
            const { data, ...rest } = this.props;
            const { relayedData } = this.state;
            return (
                <div onScroll={this.handleScroll}>
                    <WrappedComponent {...rest} data={relayedData} initLoader={this.initLoader}>
                        {this.props.data.status === options.statusWait && options.loading()}
                        {this.props.data.status === options.statusFail && options.error(this.props.data.error)}
                    </WrappedComponent>
                </div>
            );
        }
    }

    const { loader, useRedux, dataProvider, statusProvider, errorProvider, reduxPropsProvider } = options;
    return useRedux ?
        connect(
            reduxProviderTemplate({ 
                dataProvider,
                statusProvider,
                errorProvider,
                reduxPropsProvider 
            }),
             dispatchProviderTemplate(loader)
        )(InfiniteScrollable) :
        InfiniteScrollable;
}
