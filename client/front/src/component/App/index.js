import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import RootRoute from '../../route/RootRoute';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: blue[400],
            main: blue[500],
            dark: blue[600]
        },
        secondary: {
            light: pink[400],
            main: pink[500],
            dark: pink[600]
        }
    },
    breakpoints: {
        values: {
            sm: 600,
            md: 900,
            lg: 1100
        }
    }
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <React.Fragment>
                    <CssBaseline />
                    <RootRoute />
                </React.Fragment>
            </MuiThemeProvider>
        );
    }
}

export default App;
