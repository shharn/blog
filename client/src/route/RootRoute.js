import React, { Component } from 'react';
import Home from '../component/Home';
import CircularProgress from '@material-ui/core/CircularProgress';
// import PrivateRoute from '../component/PrivateRoute';
import { Route, Switch, Redirect } from 'react-router';
import Loadable from 'react-loadable';

const Admin = Loadable({
    loader: () => import('../component/Admin'),
    loading: () => <CircularProgress size={30}/>
});

const NotFound = Loadable({
    loader: () => import('../component/NotFound'),
    loading: () => <CircularProgress size={30}/>
});

class RootRoute extends Component {
    render() {
        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/menus/:menuName/articles" component={Home}/>
                    <Route path="/admin/article" component={Home}/>
                    <Route path="/admin/login" component={Admin}/>
                    <Redirect to="/"/>
                </Switch>
            </React.Fragment>
        );
    }
}

export default RootRoute;