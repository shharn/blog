//@flow
import React from 'react';

export function makeInfiniteScrollable(WrappedComponent) {
    class InfiniteScrollable extends React.Component{
        constructor(props) {
            super(props);
            this.handleScroll = this.handleScroll.bind(this);
            this.handleEndOfScroll = this.handleEndOfScroll.bind(this);
            this.isEndOfScroll = this.isEndOfScroll.bind(this);
        }

        handleScroll(e) : void {
            e.stopPropagation();
            const target = e.target;
            console.log(`offsetHeight(${target.offsetHeight}) + scrollTop(${target.scrollTop}) = scrollHeight(${target.scrollHeight})`);
            if (this.isEndOfScroll(target)) {
                this.handleEndOfScroll();
            }
        }
    
        handleEndOfScroll() : void {
            const { loader } = this.props;
            if (this.hasMore()) {
                loader();
            }
        }
    
        isEndOfScroll(target: HTMLElement) : boolean {
            const { offsetHeight, scrollTop, scrollHeight } = target;
            return offsetHeight + scrollTop >= scrollHeight;
        }

        render() : React.Node {
            return (
                <div style={{position: 'relative'}} onScroll={this.handleScroll}>
                    <WrappedComponent {...this.props}/>
                </div>
            );
        }
    }

    return InfiniteScrollable;
}