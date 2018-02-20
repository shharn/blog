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
import Cookies from 'js-cookie';
import styles from './styles';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailValue: '',
            passwordValue: ''
        };
    }

    componentDidUpdate = () => {
        this._isAuthenticated() && this._redirectToHomeWithDelay();
    }

    componentDidMount = () => {
        this._isAuthenticated() && this.props.changeLoginStatusToSuccess(Cookies.get(token.cookieKey));
    }

    _isAuthenticated = () => {
        return this.props.loginStatus === loginStatusType.LOGIN_SUCCESS || Cookies.get(token.cookieKey);
    }

    _redirectToHomeWithDelay = () => {
        setTimeout(() => this.props.history.push('/'), 2000);
    }

    _handleSubmit = () => {
        this._login();
    }

    _handleEmailChange = (e) => {
        this.setState({
            emailValue: e.target.value
        });
    }

    _handlePasswordChange = (e) => {
        this.setState({
            passwordValue: e.target.value
        });
    }

    _handleKeyUp = (e) => {
        e.keyCode === keycode('enter') && this._login();
    }

    _login = () => {
        const { emailValue, passwordValue } = this.state;
        this.props.login({ Email: emailValue, Password: passwordValue });
    }

    _getComponentOnLoginStatus = () => {
        const { loginStatus } = this.props;
        let result = null;
        switch(loginStatus) {
            case loginStatusType.LOGIN_WAIT:
                result = <CircularProgress size={30} className={this.props.classes.circularProgerss}/>
                break;
            case loginStatusType.LOGIN_SUCCESS:
                result = <Typography variant="caption">Confirmed. Will be redirected soon</Typography>
                break;
            case loginStatusType.LOGIN_FAIL:
                result = <div className={this.props.classes.bottomContainer}>
                                    <Typography className={this.props.classes.errorMessage} variant="caption">{this.props.error.message}</Typography>
                                    <Button variant="raised" color="primary" className={this.props.classes.button} onClick={this._handleSubmit}>Submit</Button>           
                                </div>
                break;
            case loginStatusType.INITIAL:
            default:
                result = <Button variant="raised" color="primary" className={this.props.classes.button} onClick={this._handleSubmit}>Submit</Button>;
                break;
        }
        return result;
    }

    render() {
        return (
            <div className={this.props.classes.root} onKeyUp={this._handleKeyUp}>
                <Paper elevation={4} className={this.props.classes.paper}>
                    <Typography className={this.props.classes.header}  variant="subheading">Login</Typography>
                    <div className={this.props.classes.formContainer}>
                        <TextField placeholder="Your Email" label="Your Email" className={this.props.classes.textfield} onChange={this._handleEmailChange}/>
                        <TextField placeholder="Password" label="Password" variant="password" className={this.props.classes.textfield} onChange={this._handlePasswordChange}/>
                    </div>
                    {this._getComponentOnLoginStatus()}
                </Paper>    
            </div>
        );
    }
}

export default withStyles(styles)(Admin)