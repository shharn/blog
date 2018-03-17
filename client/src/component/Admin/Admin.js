// @flow
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import { loginStatus as loginStatusType, token } from '../../constant';
import keycode from 'keycode';
import LocalStorage from 'local-storage';
import styles from './styles';

import type { LoginInformation, BlogError } from '../../action/auth'

type Props = {
    classes: any,
    history: any,

    loginStatus: 'INITIAL' |'LOGIN_WAIT' |'LOGIN_SUCCESS' | 'LOGIN_FAIL',
    error: BlogError,
    isAuthenticated: boolean,

    login: (loginInfo: LoginInformation) => void,
    validateToken: (token: string) => void,
    initializeLoginStatus: () => void
}

type State = {
    emailValue: string,
    passwordValue: string
}

class Admin extends Component<Props, State> {
    state = {
        emailValue: '',
        passwordValue: ''
    }

    componentDidMount = () => {
        const storedToken = LocalStorage.get(token.key);
        if (storedToken) {
            this.props.validateToken(storedToken);
        } else {
            this.props.initializeLoginStatus();
        }
    }

    componentDidUpdate = () => {
        this.props.loginStatus === loginStatusType.LOGIN_SUCCESS && this.redirectToHomeWithDelay();
    }

    componentWillUnmount = () => {
        this.props.initializeLoginStatus();
    }

    redirectToHomeWithDelay = () => {
        setTimeout(() => this.props.history.push('/'), 2000);
    }

    handleSubmit = () => {
        const { emailValue, passwordValue } = this.state;
        this.props.login({ email: emailValue, password: passwordValue });
    }

    handleEmailChange = (e) => {
        this.setState({
            emailValue: e.target.value
        });
    }

    handlePasswordChange = (e) => {
        this.setState({
            passwordValue: e.target.value
        });
    }

    handleKeyUp = (e) => {
        e.keyCode === keycode('enter') && this.handleSubmit();
    }

    getComponentOnLoginStatus = () => {
        const { loginStatus } = this.props;
        let result = null;
        
        switch(loginStatus) {
            case loginStatusType.LOGIN_WAIT:
                result = <CircularProgress className={this.props.classes.circularProgerss}/>
                break;
            case loginStatusType.LOGIN_SUCCESS:
                result = <Typography variant="caption">Confirmed. Will be redirected soon</Typography>
                break;
            case loginStatusType.LOGIN_FAIL:
                result = (
                    <div className={this.props.classes.bottomContainer}>
                        <Typography className={this.props.classes.errorMessage} variant="caption">{this.props.error.message}</Typography>
                        <Button variant="raised" color="primary" className={this.props.classes.button} onClick={this.handleSubmit}>Submit</Button>           
                    </div>
                )
                break;
            case loginStatusType.INITIAL:
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