// @flow
import React, { Component } from 'react';

class GoogleOAuthButton extends Component {
    componentDidMount() {
        window.gapi.signin2.render('g-signin2', {
            'scope': 'profile email',
            'width': 252,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onSuccess': googleUser => console.log('Login as ' + googleUser.getBasicProfile().getName()),
            'onFailure': err => { 
                console.dir(err);
                setTimeout(() => document.querySelector('.abcRioButton').style.width = '100%', 100);
            }
        });
    }

    render = () => {
        return (
            <div id="g-signin2" />
        )
    }
}

export default GoogleOAuthButton;