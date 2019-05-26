const secondLayoutBreakpoint = 1086;

export default theme => ({
    container: {
        margin: '0 auto',
        position: 'relative',
        height: 'calc(100vh - 96px)',
        overflow: 'auto',
        padding: '2px'
    },
    header: {
        margin: '15px 10px',
        color: 'rgba(0, 0, 0, 0.75)'
    },
    listContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(325px, 400px))',
        gridAutoRows: 'minmax(400px, 440px)',
        gridGap: '10px',
        justifyContent: 'center'
    },
    firstCard: {
        width: '100%',
        height: '100%',
        borderRadius: '15px',
        margin: '0 auto',
        position: 'relative',
        [theme.breakpoints.up(secondLayoutBreakpoint)]: {
            gridRow: '1 / span 2',
            gridColumn: '1 / span 2'
        }
    },
    card: {
        width: '100%',
        height: '100%',
        borderRadius: '15px',
        margin: '0 auto',
        position: 'relative'
    },
    firstCardImage: {
        height: '65%',
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.up(secondLayoutBreakpoint)]: {
            height: '80%'
        }
    },
    firstCardContent: {
        height: '35%',
        [theme.breakpoints.up(secondLayoutBreakpoint)]: {
            height: '20%',
        }
    },
    cardImage: {
        height: '65%',
        display: 'flex',
        justifyContent: 'center'
    },
    cardContent: {
        height: '35%',
    },
    emptyMessage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'rgba(0, 0, 0, 0.5)'
    }
})