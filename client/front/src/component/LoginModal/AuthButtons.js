// @flow
import * as React from 'react';
import Button from '@material-ui/core/Button';
import {
    AuthStatus,
    AuthPlatform
} from '../../constant';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { authButtons } from './styles';
import { Typography } from '@material-ui/core';
import type { Element } from 'react';
import type {
    WithStylesProps,
    ClientError
} from '../../flowtype';

type Props = {
    authStatus: $Values<AuthStatus>,
    error: ClientError, 
    authCodeURL: string,

    oauth: (platform :$Values<AuthPlatform>) => void,
    showAdminContent: () => void
}

const buttonBuilder = (metadata: { label: string, classes: string, onClick: () => void }): Element<*> => (
    <Button 
        variant="contained"
        className={metadata.classes}
        onClick={metadata.onClick}
        key={metadata.label}
    >
        {metadata.label}
    </Button>
);

class AuthButtons extends React.Component<Props & WithStylesProps> {
    hiddenAnchor: { current: null | React.ElementRef<any> }

    constructor(props) {
        super(props);
        this.hiddenAnchor = React.createRef();
    }

    componentDidUpdate = () => {
        if (this.props.authStatus === AuthStatus.OAUTH_AUTHORIZATION_SUCCESS) {
            if (this.hiddenAnchor && this.hiddenAnchor.current) {
                this.hiddenAnchor.current.click();
            }
        }
    }

    render = () => {
        const { classes, showAdminContent, authStatus, oauth, authCodeURL, error } = this.props;
        const buttonsMetadata = [
            { label: 'Admin', classes: classes.signinButton, onClick: showAdminContent },
            { label: 'Google', classes: classes.signinButton, onClick: () => oauth(AuthPlatform.GOOGLE)},
        ];
        return (
            <div className={classes.container}>
                {buttonsMetadata.map(metadata => buttonBuilder(metadata))}
                {authStatus === AuthStatus.LOGIN_WAIT && <CircularProgress size={30} classes={{ root: classes.circularProgress }} />}
                {error && error.length && <Typography variant="body1" className={classes.errorMessage}>{error}</Typography>}
                <a ref={this.hiddenAnchor} href={authCodeURL} target='_blank' style={{ display: 'none' }}>Auth code URL</a>
            </div>
        )
    }
}

export default withStyles(authButtons)(AuthButtons);