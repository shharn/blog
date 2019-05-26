const secondLayoutBreakpoint = 1086;

export default theme => ({
    listContainer: {
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(325px, 400px))',
        gridAutoRows: 'minmax(400px, 440px)',
        gridGap: '10px',
        justifyContent: 'center'
    },
    header: {
        margin: '15px 10px',
        color: 'rgba(0, 0, 0, 0.85)'
    },
    article: {
        width: '100%',
        height: '100%',
        borderRadius: '15px',
        margin: '0 auto',
        position: 'relative'
    },
    articleImage: {
        height: '65%',
        display: 'flex',
        justifyContent: 'center'
    },
    articleContent: {
        height: '35%',
    },
    emptyText: {
        position: 'fixed',
        top: '52%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'rgba(0, 0, 0, 0.6)',
        [theme.breakpoints.up('sm')]: {
            left: 'calc(50% + 120px)'
        },
    }
});