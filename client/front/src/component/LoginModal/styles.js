import red from '@material-ui/core/colors/red';

export const dialog = {
    dialogPaper: {
        minWidth: '300px'
    },
    title: {
        margin: '40px auto 0',
        paddingBottom: 0
    },
    clearButton: {
        position: 'absolute',
        right: 0
    },
    backButton: {
        position: 'absolute',
        left: 0
    }
};

export const adminContent = {
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '10px 0',
        width: '100%'
    },
    emailForm: {
        marginBottom: '10px',
        width: '100%'
    },
    passwordForm: {
        width: '100%'
    },
    submitButton: {
        margin: '30px auto 0'
    },
    successMessage: {
        marginTop: '15px'
    },
    errorMessage: {
        color: red[500],
        marginTop: '15px'
    },
    circularProgress: {
        marginTop: '20px'
    }
};

export const authButtons = {
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '25px 0px 0px 0px'
    },
    signinButton: {
        width: '100%',
        backgroundColor: 'white',
        height: '50px',
        marginBottom: '15px'
    },
    circularProgress: {
        margin: '20px 0px 0px 0px'
    },
    errorMessage: {
        color: 'red'
    }
};

export const thirdPartyOAuthButtonsContainer = {
    container: {
        marginTop: '10px',
        width: '100%'
    }
}