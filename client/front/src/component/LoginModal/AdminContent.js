// @flow
import * as React  from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import keycode from 'keycode';
import { sha512 } from 'js-sha512';
import { AuthStatus } from '../../constant';
import { adminContent } from './styles';

import type { Element } from 'react';
import type { 
    LoginInformation,
    ClientError,
    WithStylesProps
} from '../../flowtype';

type Props = {
    authStatus: $Values<AuthStatus>,
    isAuthenticated: boolean,
    error: ClientError,

    login: (loginInfo: LoginInformation) => void
}

type State = {
    email: string,
    password: string
}

class AdminContent extends React.Component<Props & WithStylesProps, State> {
    state = {
        email: '',
        password: ''
    }

    submit = (): void => {
        const { email, password } = this.state;
        const hashedPassword: string = sha512(password);
        this.props.login({ 
            email: email, 
            password: hashedPassword 
        });
    }

    onSubmitButtonClick = (): void => {
        this.submit();
    }

    onTextFieldChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onKeyUp = (e: SyntheticKeyboardEvent<>): void => {
        e.keyCode === keycode('enter') && this.submit();
    }

    getComponentOnLoginStatus = (): Element<*> => {
        const { authStatus, classes, error } = this.props;
        let result = null;
        
        switch(authStatus) {
            case AuthStatus.LOGIN_WAIT:
                result = <CircularProgress className={classes.circularProgerss}/>;
                break;
            case AuthStatus.LOGIN_SUCCESS:
                result = <Typography className={classes.successMessage} variant="caption">Confirmed. Will be redirected soon</Typography>;
                break;
            case AuthStatus.LOGIN_FAILED:
                result = (
                    <React.Fragment>
                        <Typography className={classes.errorMessage} variant="caption">{error.message}</Typography>
                        <Button variant="contained" color="primary" className={classes.submitButton} onClick={this.onSubmitButtonClick}>Submit</Button>
                    </React.Fragment>
                );
                break;
            case AuthStatus.INITIAL:
            default:
                result = <Button variant="contained" color="primary" className={classes.submitButton} onClick={this.onSubmitButtonClick}>Submit</Button>;
                break;
        }
        return result;
    }

    render() {
        const { authStatus, classes } = this.props;
        const disableForm = authStatus === AuthStatus.LOGIN_SUCCESS;
        return (
            <FormControl className={classes.formContainer} onKeyUp={this.onKeyUp}>
                <TextField
                    disabled={disableForm}
                    placeholder="Your Email"
                    label="Your Email"
                    className={classes.emailForm}
                    onChange={this.onTextFieldChange}
                    name="email"
                />
                <TextField
                    disabled={disableForm}
                    placeholder="Password"
                    label="Password"
                    type="password"
                    className={classes.passwordForm}
                    onChange={this.onTextFieldChange}
                    name="password"
                />
                {this.getComponentOnLoginStatus()}
            </FormControl>
        );
    }
}

export default withStyles(adminContent)(AdminContent);