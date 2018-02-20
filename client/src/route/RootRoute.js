import React, { Component } from 'react';
import Home from '../component/Home/Home';
import Loading from '../component/Loading/Loading';
import { Route } from 'react-router';
import Loadable from 'react-loadable';

const Admin = Loadable({
    loader: () => import('../component/Admin'),
    loading: Loading
})

class RootRoute extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Home}/>
                <Route path="/admin" component={Admin}/>
            </div>
        );
    }
}

export default RootRoute;