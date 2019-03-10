// @flow
import React, { Component } from 'react';
import ls from 'local-storage';
import { Token } from '../../constant';

type Props = {
    isAuthenticated: boolean,
    authenticate: (token: string) => void
};

class AuthChecker extends Component<Props> {
    componentDidMount = () => {
        if (!this.props.isAuthenticated) {
            const token = ls.get(Token.key);
            token && this.props.authenticate(token);
          }
    }

    render = () => null
}

export default AuthChecker;