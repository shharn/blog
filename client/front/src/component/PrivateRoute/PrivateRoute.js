// @flow
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

type Props = {
    isAuthenticated: boolean,
    component: React.ComponentType<*>
};

class PrivateRoute extends React.Component<Props> {
    render = () => {
        const { isAuthenticated, component: Component, ...rest } = this.props;
        return (
            <Route {...rest}
                render={props => isAuthenticated ? <Component {...props}/> : <Redirect to="/"/>}/>
        );
    }
}

export default PrivateRoute;