import red from '@material-ui/core/colors/red';

export default {
    root: {
        minWidth: '300px',
        minHeight: '300px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
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