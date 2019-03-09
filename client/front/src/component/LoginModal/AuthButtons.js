// @flow
import React, { Component } from 'react';
import OAuthButtons from './OAuthButtons';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { authButtons } from './styles';

import type { 
    WithStylesProps
} from '../../flowtype';

type Props = {
    showAdminContent: () => void
}

class AuthButtons extends Component<Props & WithStylesProps> {
    render = () => {
        const { classes, showAdminContent } = this.props;
        return (
            <div className={classes.container}>
                <Button 
                    variant="contained" 
                    className={classes.adminButton}
                    onClick={showAdminContent}
                >
                    Admin
                </Button>
                <OAuthButtons />
            </div>
        )
    }
}

export default withStyles(authButtons)(AuthButtons);