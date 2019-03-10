// @flow
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import BackIcon from '@material-ui/icons/KeyboardBackspace';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AuthButtons from './AuthButtons';
import AdminContent from './AdminContent';
import { withStyles } from '@material-ui/core/styles';
import { AuthStatus } from '../../constant';

import { dialog } from './styles';

import type { 
    LoginInformation,
    ClientError,
    RouterProps,
    WithStylesProps
} from '../../flowtype';

type Props = {
    open: boolean,
    authStatus: $Values<AuthStatus>,
    isAuthenticated: boolean,
    error: ClientError,

    login: (loginInfo: LoginInformation) => void,
    validateToken: (token: string) => void,
    initializeAuthStatus: () => void,
    closeLoginModal: () => void    
}

type State = {
    adminContent: boolean
};

class LoginModal extends Component<Props & WithStylesProps & RouterProps, State> {
    state = {
        adminContent: false
    }

    componentDidUpdate =  () => {
        if (this.props.authStatus === AuthStatus.LOGIN_SUCCESS) {
            this.props.initializeAuthStatus();
            this.setState({ adminContent: false }); 
            this.props.closeLoginModal();
        }
    }

    componentWillUnmount = () => {
        this.props.initializeAuthStatus();
    }

    toggleAdminContent = (adminContent: boolean) => () => {
        this.setState({ adminContent });
    }

    render = () => {
        const { toggleAdminContent } = this;
        const { 
            open,
            classes,
            isAuthenticated,
            authStatus,
            closeLoginModal,
            login,
            error
        } = this.props;
        const { adminContent } = this.state;
        return (
            <Dialog
                open={open}
                onClose={this.onDialogClose}
                maxWidth='md'
                classes={{ paper: classes.dialogPaper }}
            >
                {adminContent ?
                    <IconButton 
                        className={classes.backButton}
                        aria-label="back"
                        onClick={toggleAdminContent(false)}
                    >
                        <BackIcon />
                    </IconButton> :
                    <IconButton 
                    className={classes.clearButton} 
                    aria-label="clear"
                    onClick={closeLoginModal}
                >
                    <ClearIcon />
                </IconButton>
                }
                <DialogTitle classes={{ root: classes.title }}>Login</DialogTitle>
                <DialogContent>
                    {adminContent ? 
                        <AdminContent 
                            isAuthenticated={isAuthenticated}
                            login={login}
                            authStatus={authStatus}
                            error={error}
                        /> :
                        <AuthButtons showAdminContent={toggleAdminContent(true)}/>
                    }
                </DialogContent>
            </Dialog>
        );
    }
}

export default withStyles(dialog)(LoginModal) 