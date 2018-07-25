import React, { Component } from 'react';
import Home from '../component/Home';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Route, Redirect } from 'react-router';
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
                <Route path="/menus/:menuName/articles" component={Home}/>
                <Route path="/articles/create" component={Home}/>
                <Route path="/admin" component={Admin}/>
                <Redirect to="/"/>
                {/* <Route component={({ location }) => <div>No Match In RootRoute. {location.pathname}</div>}/> */}
            </React.Fragment>
        );
    }
}

export default RootRoute;