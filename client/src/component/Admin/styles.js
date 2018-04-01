import red from 'material-ui/colors/red';

export default {
    root: {
        width: '100%',
        minWidth: '300px',
        minHeight: '300px',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paper: {
        width: '300px',
        height: '300px',
        padding: '20px 30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        margin: '10px 0'
    },
    header: {
        marginTop: '10px'
    },
    textfield: {
        width: '100%',
        margin: '10px 0'
    },
    bottomContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    button: {
        margin: '10px 0',
        width: '90px'
    },
    errorMessage: {
        color: red[500]
    },
    circularProgress: {
        marginTop: '20px'
    }
};