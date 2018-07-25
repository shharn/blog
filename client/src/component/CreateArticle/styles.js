export default theme => ({
    container: {
        position: 'relative',
        height: 'calc(100% - 112px)',
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
        marginTop: '20px',
    },
    selectContainer: {
        width: '100px',
    },
    shrinkLabel: {
        transform: 'translate(0, 0)'
    },
    selectRoot: {
        marginTop: '6px',
    }
});