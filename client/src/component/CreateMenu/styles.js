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
    footer: {
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing.unit
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    iconButton: {
        margin: theme.spacing.unit
    }
})