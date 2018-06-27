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
            <React.Fragment>
                <Route exact path="/" component={Home}/>
                <Route path="/admin" component={Admin}/>
                <Route path="/menus/:id/articles" component={Home}/>
            </React.Fragment>
        );
    }
}

export default RootRoute;