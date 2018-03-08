export default theme => ({
    createMenuContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    dropboxContainer: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
    },
    formControl: {
        width: '167px'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    iconButton: {
        margin: theme.spacing.unit
    }
})