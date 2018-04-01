export default theme =>({
    drawerHeader: Object.assign(theme.mixins.toolbar, {
        fontSize: 20,
        width: '100%',
        height:' 100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        textDecoration: 'none'
    })
});