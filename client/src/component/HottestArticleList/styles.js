export default theme => ({
    container: {
        margin: '0 auto',
        position: 'relative'
    },
    firstCard: {
        width: '100%',
        [theme.breakpoints.up(1100)]: {
            float: 'left',
            width: 'calc(60% - 10px)',
            height: '90vh',
            marginRight: '10px'
        }
    },
    remainingRoot: {
        width: '100%',
        marginTop: '10px',
        [theme.breakpoints.up(900)]: {
            display: 'grid',
            gridGap: '10px',
            gridTemplateColumns: 'repeat(2, 1fr)',
            marginTop: '10px',
        },
        [theme.breakpoints.up(1100)]: {
            display: 'block',
            width: '40%',
            height: '90vh',
            overflow: 'auto',
        }
    },
    card: {
        width: '100%',
        marginBottom: '10px',
        [theme.breakpoints.up(900)]: {
            marginBottom: 0,
        },
        [theme.breakpoints.up(1100)]: {
            width: '100%',
            marginBottom: '10px',
        }
    },
    smallMedia: {
        height: '200px',
    },
    largeMedia: {
        height: '200px',
        [theme.breakpoints.up(900)]: {
            height: '300px'
        },
        [theme.breakpoints.up(1100)]: {
            height: '70vh',
        }
    },
})