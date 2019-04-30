// @flow
import React, { Component } from 'react';
import { Token } from '../../constant';

type Props = {
    isAuthenticated: boolean,
    authenticate: (token: string) => void
};

class AuthChecker extends Component<Props> {
    componentDidMount = () => {
        if (!this.props.isAuthenticated) {
            const token = window.localStorage.getItem(Token.key);
            token && this.props.authenticate(token);
          }
    }

    render = () => null
}

export default AuthChecker;