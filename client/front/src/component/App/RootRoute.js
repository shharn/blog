// @flow
import React, { Component } from 'react';
import Home from '../Home';
import { 
    Route, 
    Switch, 
    Redirect 
} from 'react-router';

class RootRoute extends Component<{}> {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/menus/:menuName/articles" component={Home}/>
                <Route exact path="/menus/:menuName/articles/:articleName" component={Home}/>
                <Route path="/admin/article" component={Home}/>
                <Redirect to="/"/>
            </Switch>
        );
    }
}

export default RootRoute;