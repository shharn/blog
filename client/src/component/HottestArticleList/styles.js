export default theme => ({
    container: {
        // display: 'grid',
        // margin: '0 auto',
        // maxWidth: '1400px',
        // gridGap: '15px',
        // [theme.breakpoints.up(900)]: {
        //     gridTemplateColumns: 'repeat(2, 1fr)',
        // },
        // [theme.breakpoints.up(1100)]: {
        //     gridTemplate: 'repeat(2, 1fr) / repeat(4, 1fr)',
        // }
        margin: '0 auto',
        position: 'relative'
    },
    firstCard: {
        width: '100%',
        [theme.breakpoints.up(900)]: {
        },
        [theme.breakpoints.up(1100)]: {
            float: 'left',
            width: 'calc(50% - 10px)',
            height: '90vh',
            marginRight: '10px'
        }
    },
    remainingRoot: {
        width: '100%',
        [theme.breakpoints.up(900)]: {
            display: 'grid',
            gridGap: '10px',
            gridTemplateColumns: 'repeat(2, 1fr)',
            marginTop: '10px',
        },
        [theme.breakpoints.up(1100)]: {
            display: 'block',
            width: '50%',
            height: '90vh',
            overflow: 'auto',
        }
    },
    card: {
        width: '100%',
        [theme.breakpoints.up(900)]: {
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
        }
    },
})