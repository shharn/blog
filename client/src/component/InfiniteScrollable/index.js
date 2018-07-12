//@flow
import React from 'react';
import { connect } from 'react-redux';

export function makeInfiniteScrollable(options) {
    const { loader, provider, useRedux, offset, countPerRequest, reduxProvider } = options;
    return function innerFunc(WrappedComponent) {
        class InfiniteScrollable extends React.Component{
            constructor(props) {
                super(props);

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
                this.innerStorage = null;
            }

            componentDidMount() {
                this.load();
            }

            handleScroll(e) : void {
                const target = e.target;
                if (this.isEndOfScroll(target)) {
                    console.log('End of scroll');
                    this.handleEndOfScroll();
                }
            }
        
            handleEndOfScroll() : void {
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
                return (
                    <div onScroll={this.handleScroll}>
                        {useRedux ? 
                            <WrappedComponent {...this.props}/> :
                            <WrappedComponent {...this.props} {...provider(this.innerStorage)}/>}
                    </div>
                );
            }
        }

        if (useRedux) {
            const mdtp = dispatch => {
                return {
                    loader: (offset, count) => dispatch(loader(offset, count))
                };
            };
            return connect(reduxProvider, mdtp)(InfiniteScrollable)
        } else {
            return InfiniteScrollable;
        }
    }
}

// const provider = innerStorage => {
    // some processing
    // and ...
    // return the reesult
//}