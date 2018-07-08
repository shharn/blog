import React, { Component } from 'react';
import CC from './InfiniteScrollable';

export default CC;

export function makeInfiniteScrollable(Component) {
    return class InfiniteScrollable extends React.Component{
        constructor(props) {
            super(props);
            this.target = React.createRef();
        }

        componentDidMount() {
            this.target.current.addEventListener('scroll', this.handleScroll);
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
            const { target } = this.target.current;
            const { offsetHeight, scrollTop, scrollHeight } = target;
            return offsetHeight + scrollTop >= scrollHeight;
        }

        render() {
            return React.forwardRef((props, ref) => <Component {...props} ref={this.target}/>)
        }
    }
}