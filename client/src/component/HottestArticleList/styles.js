export default theme => ({
    container: {
        margin: '0 auto',
        position: 'relative',
        height: 'calc(100vh - 112px)',
        overflow: 'auto',
        padding: '2px',
        [theme.breakpoints.up('lg')]: {
            overflow: 'hidden'
        }
    },
    firstCard: {
        width: '100%',
        [theme.breakpoints.up('lg')]: {
            float: 'left',
            width: 'calc(60% - 10px)',
            height: 'calc(100% - 3px)',
            marginRight: '10px'
        }
    },
    remainingRoot: {
        width: '100%',
        marginTop: '10px',
        [theme.breakpoints.up('md')]: {
            display: 'grid',
            gridGap: '10px',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridAutoRows: 'minmax(430px, max-content)',
            marginTop: '10px',
        },
        [theme.breakpoints.up('lg')]: {
            display: 'block',
            width: '40%',
            height: 'calc(100% - 3px)',
            overflow: 'auto',
            marginTop: '0',
        }
    },
    card: {
        width: '100%',
        marginBottom: '10px',
        [theme.breakpoints.up('md')]: {
            height: '100%',
            marginBottom: 0,
        },
        [theme.breakpoints.up('lg')]: {
            height: 'auto',
            width: '99%',
            marginBottom: '10px',
        }
    },
    smallMedia: {
        height: '250px',
    },
    largeMedia: {
        height: '250px',
        [theme.breakpoints.up('md')]: {
            height: '320px'
        },
        [theme.breakpoints.up('lg')]: {
            height: '70vh',
        }
    },
})