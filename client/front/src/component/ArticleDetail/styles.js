export default theme => ({
    container: {
        position: 'relative',
        padding: '30px 30px 5px 30px',
        maxWidth: '900px',
        margin: '0 auto 20px'
    },
    title: {
        color: theme.palette.common.black,
        marginBottom: '40px',
    },
    centered: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
})