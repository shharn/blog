import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends Component {
    render() {
        const { isAuthenticated, component: Component, ...rest } = this.props;
        return (
            <Route {...rest}
                render={props => isAuthenticated ? <Component {...props}/> : <Redirect to="/"/>}/>
        );
    }
}

export default PrivateRoute;