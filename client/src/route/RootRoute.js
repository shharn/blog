import React, { Component } from 'react';
import Home from '../component/Home';
import { CircularProgress } from 'material-ui/Progress';
import { Route } from 'react-router';
import Loadable from 'react-loadable';

const Admin = Loadable({
    loader: () => import('../component/Admin'),
    loading: () => <CircularProgress size={30}/>
});

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