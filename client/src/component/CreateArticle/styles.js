export default theme => ({
    container: {
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px',
    },
    input: {
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
        marginTop: '10px',
    },
    multilineRoot: {
        padding: 0
    },
    selectContainer: {
        width: '100px',
        marginTop: '20px',
    },
    shrinkLabel: {
        transform: 'translate(0, 0)'
    },
    selectRoot: {
        marginTop: '6px',
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
    }
});