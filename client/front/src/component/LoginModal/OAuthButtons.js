import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import GoogleOAuthButton from './GoogleOAuthButton';
import { thirdPartyOAuthButtonsContainer } from './styles';

class OAuthButtons extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <GoogleOAuthButton />
            </div>
        );
    }
}

export default withStyles(thirdPartyOAuthButtonsContainer)(OAuthButtons);