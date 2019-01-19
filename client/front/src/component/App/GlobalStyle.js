import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    '@global': {
        html: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontSize: '1rem',
            fontWeight: '400',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: '1.5em'
        }
    }
});

class GlobalStyle extends React.Component {
    render() {
        return null;
    }
}

export default withStyles(styles, { name: 'GlobalStyle' })(GlobalStyle);
