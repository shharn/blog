const lastLayoutBreakpoint = 1450;

export default theme => ({
    container: {
        margin: '0 auto',
        position: 'relative',
        height: 'calc(100vh - 96px)',
        overflow: 'auto',
        padding: '2px',
        [theme.breakpoints.up(lastLayoutBreakpoint)]: {
            overflow: 'hidden'
        }
    },
    header: {
        margin: '15px 10px',
        color: 'rgba(0, 0, 0, 0.75)'
    },
    firstCard: {
        width: '100%',
        [theme.breakpoints.up(lastLayoutBreakpoint)]: {
            float: 'left',
            width: 'calc(70% - 10px)',
            height: 'calc(100% - 70px)',
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
            marginTop: '10px',
        },
        [theme.breakpoints.up(lastLayoutBreakpoint)]: {
            display: 'block',
            width: '30%',
            height: 'calc(100% - 70px)',
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
        [theme.breakpoints.up(lastLayoutBreakpoint)]: {
            height: 'auto',
            width: '99%',
            marginBottom: '10px'
        }
    },
    largeMedia: {
        height: '50vw',
        [theme.breakpoints.up('sm')]: {
            height: '36vw',
        },
        [theme.breakpoints.up('md')]: {
            height: '53vw',
        },
        [theme.breakpoints.up(lastLayoutBreakpoint)]: {
            height: '53vw',
            maxHeight: '770px'
        },
    },
    smallMedia: {
        height: '50vw',
        [theme.breakpoints.up('sm')]: {
            height: '36vw',
        },
        [theme.breakpoints.up('md')]: {
            height: '24vw',
        },
        [theme.breakpoints.up(lastLayoutBreakpoint)]: {
            height: '16vw',
        },
    },
    emptyMessage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'rgba(0, 0, 0, 0.5)'
    }
})