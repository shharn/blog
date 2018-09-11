// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { LoginStatus as LoginStatusType, Token } from '../../constant';
import keycode from 'keycode';
import LocalStorage from 'local-storage';
import styles from './styles';

import type { Element } from 'react';
import type { 
    LoginInformation,
    ClientError,
    RouterProps,
    WithStylesProps
} from '../../flowtype';

type Props = {
    loginStatus: $Values<LoginStatusType>,
    isAuthenticated: boolean,
    error: ClientError,

    login: (loginInfo: LoginInformation) => void,
    validateToken: (token: string) => void,
    initializeLoginStatus: () => void
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

    componentDidMount = () => {
        const storedToken = LocalStorage.get(Token.key);
        if (storedToken) {
            this.props.validateToken(storedToken);
        } else {
            this.props.initializeLoginStatus();
        }
    }

    componentDidUpdate () {
        this.props.loginStatus === LoginStatusType.LOGIN_SUCCESS && this.redirectToHomeWithDelay();
    }

    componentWillUnmount() {
        this.props.initializeLoginStatus();
    }

    redirectToHomeWithDelay = () : void=> {
        setTimeout(() => this.props.history.push('/'), 1000);
    }

    handleSubmit = (): void => {
        const { emailValue, passwordValue } = this.state;
        this.props.login({ 
            email: emailValue, 
            password: passwordValue 
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

    handleKeyUp = (e: SyntheticKeyboardEvent<>) => {
        e.keyCode === keycode('enter') && this.handleSubmit();
    }

    getComponentOnLoginStatus = (): Element<*> => {
        const { loginStatus } = this.props;
        let result = null;
        
        switch(loginStatus) {
            case LoginStatusType.LOGIN_WAIT:
                result = <CircularProgress className={this.props.classes.circularProgerss}/>;
                break;
            case LoginStatusType.LOGIN_SUCCESS:
                result = <Typography variant="caption">Confirmed. Will be redirected soon</Typography>;
                break;
            case LoginStatusType.LOGIN_FAIL:
                result = (
                    <div className={this.props.classes.bottomContainer}>
                        <Typography className={this.props.classes.errorMessage} variant="caption">{this.props.error.message}</Typography>
                        <Button variant="raised" color="primary" className={this.props.classes.button} onClick={this.handleSubmit}>Submit</Button>           
                    </div>
                );
                break;
            case LoginStatusType.INITIAL:
            default:
                result = <Button variant="raised" color="primary" className={this.props.classes.button} onClick={this.handleSubmit}>Submit</Button>;
                break;
        }
        return result;
    }

    render() {
        return (
            <div className={this.props.classes.root} onKeyUp={this.handleKeyUp}>
                <Paper elevation={4} className={this.props.classes.paper}>
                    <Typography className={this.props.classes.header}  variant="subheading">Login</Typography>
                    <div className={this.props.classes.formContainer}>
                        <TextField placeholder="Your Email" label="Your Email" className={this.props.classes.textfield} onChange={this.handleEmailChange}/>
                        <TextField placeholder="Password" label="Password" type="password" className={this.props.classes.textfield} onChange={this.handlePasswordChange}/>
                    </div>
                    {this.getComponentOnLoginStatus()}
                </Paper>    
            </div>
        );
    }
}

export default withStyles(styles)(Admin) 