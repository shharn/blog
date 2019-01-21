export default theme => ({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
    },
    input: {
        height: '20px',
        padding: '7px 9px',
        border: '1px solid #ced4da',
        marginTop: '7px',
        borderRadius: 5,
        backgroundColor: theme.palette.common.white,
        '&:focus': {
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.1rem rgba(0, 123, 255, .5)'
        }
    },
    formContainer: {
        marginTop: '15px',
    },
    multilineRoot: {
        padding: 0
    },
    selectContainer: {
        width: '100px',
        marginTop: '30px',
    },
    shrinkLabel: {
        transform: 'translate(0, 0)'
    },
    selectRoot: {
        marginTop: '5px',
    },
    footer: {
        marginTop: '10px',
        position: 'relatvie',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        margin: theme.spacing.unit
    },
    errorMessage: {
        textAlign: 'center'
    },
    imageUploadFormContainer: {
        display: 'flex',
        flexDirecton: 'row',
        width: '100%',
        marginTop: '10px'
    },
    imageUploadFormLabel: {
        width: '75%',
        border: '1px solid #ced4da',
        borderRadius: '5px',
        lineHeight: '34px',
        padding: '0 10px'
    },
    imageUploadFormButton: {
        width: '25%',
        marginLeft: '10px',
    },
    hiddenFileInput: {
        opacity: '0',
        position: 'absolute',
        right: '0',
        height: '36px',
        width: '25%',
        cursor: 'pointer'
    }
});