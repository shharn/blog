import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    '@global': {
        html: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontSize: '1rem',
            fontWeight: '400',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: '1.5em',
            [theme.breakpoints.down('sm')]: {
                fontSize: '0.8rem'
            }
        }
    }
});

class GlobalStyle extends React.Component {
    render() {
        return null;
    }
}

export default withStyles(styles, { name: 'GlobalStyle' })(GlobalStyle);
