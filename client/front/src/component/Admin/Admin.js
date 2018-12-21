// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { AuthStatus } from '../../constant';
import keycode from 'keycode';
import { sha512 } from 'js-sha512';
import styles from './styles';
import type { Element } from 'react';
import type { 
    LoginInformation,
    ClientError,
    RouterProps,
    WithStylesProps
} from '../../flowtype';

type Props = {
    authStatus: $Values<AuthStatus>,
    isAuthenticated: boolean,
    error: ClientError,

    login: (loginInfo: LoginInformation) => void,
    validateToken: (token: string) => void
}

type State = {
    emailValue: string,
    passwordValue: string
}

class Admin extends Component<Props & WithStylesProps & RouterProps, State> {
    state = {
        emailValue: '',
        passwordValue: ''
    }

    componentDidMount() {
        this.props.isAuthenticated && this.redirectToHomeWithDelay();
    }

    componentDidUpdate =  () => {
        this.props.authStatus === AuthStatus.LOGIN_SUCCESS && this.redirectToHomeWithDelay();
    }

    redirectToHomeWithDelay = (): void=> {
        setTimeout(() => document.location.href='/', 1000);
    }

    handleSubmit = (): void => {
        const { emailValue, passwordValue } = this.state;
        const hashedPassword: string = sha512(passwordValue);
        this.props.login({ 
            email: emailValue, 
            password: hashedPassword 
        });
    }

    handleEmailChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
        this.setState({
            emailValue: e.target.value
        });
    }

    handlePasswordChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
        this.setState({
            passwordValue: e.target.value
        });
    }

    handleKeyUp = (e: SyntheticKeyboardEvent<>): void => {
        e.keyCode === keycode('enter') && this.handleSubmit();
    }

    getComponentOnLoginStatus = (): Element<*> => {
        const { authStatus } = this.props;
        let result = null;
        
        switch(authStatus) {
            case AuthStatus.LOGIN_WAIT:
                result = <CircularProgress className={this.props.classes.circularProgerss}/>;
                break;
            case AuthStatus.LOGIN_SUCCESS:
                result = <Typography variant="caption">Confirmed. Will be redirected soon</Typography>;
                break;
            case AuthStatus.LOGIN_FAILED:
                result = (
                    <div className={this.props.classes.bottomContainer}>
                        <Typography className={this.props.classes.errorMessage} variant="caption">{this.props.error.message}</Typography>
                        <Button variant="raised" color="primary" className={this.props.classes.button} onClick={this.handleSubmit}>Submit</Button>           
                    </div>
                );
                break;
            case AuthStatus.INITIAL:
            default:
                result = <Button variant="raised" color="primary" className={this.props.classes.button} onClick={this.handleSubmit}>Submit</Button>;
                break;
        }
        return result;
    }

    render = () => {
        const { authStatus } = this.props;
        return (
            <div className={this.props.classes.root} onKeyUp={this.handleKeyUp}>
                <Paper elevation={4} className={this.props.classes.paper}>
                    <Typography className={this.props.classes.header}  variant="subheading">Login</Typography>
                    <div className={this.props.classes.formContainer}>
                        <TextField
                            disabled={authStatus === AuthStatus.LOGIN_SUCCESS}
                            placeholder="Your Email"
                            label="Your Email"
                            className={this.props.classes.textfield} 
                            onChange={this.handleEmailChange}/>
                        <TextField
                            disabled={authStatus === AuthStatus.LOGIN_SUCCESS}
                            placeholder="Password" 
                            label="Password" 
                            type="password" 
                            className={this.props.classes.textfield} 
                            onChange={this.handlePasswordChange}/>
                    </div>
                    {this.getComponentOnLoginStatus()}
                </Paper>    
            </div>
        );
    }
}

export default withStyles(styles)(Admin) 