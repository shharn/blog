export default theme => ({
    container: {
        position: 'relative',
        padding: '30px 30px 5px 30px',
        maxWidth: '1000px',
        margin: '0 auto'
    },
    title: {
        color: theme.palette.common.black,
        marginBottom: '40px',
    },
    divider: {
        marginTop: '35px',
    },
    noArticleText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
})