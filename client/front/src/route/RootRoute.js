// @flow
import * as React from 'react';
import Home from '../component/Home';
import { 
    Route, 
    Switch, 
    Redirect 
} from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import loadable from 'react-loadable';

const Admin = loadable({
    loader: () => import(/* webpackChunkName: "admin"*/ '../component/Admin'),
    loading: () => <CircularProgress size={30}/>
})

class RootRoute extends React.Component<{}> {
    render() {
        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/menus/:menuName/articles" component={Home}/>
                    <Route exact path="/menus/:menuName/articles/:articleName" component={Home}/>
                    <Route path="/admin/article" component={Home}/>
                    <Route path="/login" component={Admin}/>
                    <Redirect to="/"/>
                </Switch>
            </React.Fragment>
        );
    }
}

export default RootRoute;