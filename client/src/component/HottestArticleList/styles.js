export default theme => ({
    container: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between'
    },
    cardFirst: {
        width: '100%',
        marginBottom: '15px',
        [theme.breakpoints.up('sm')]: {
        }
    },
    card: {
        marginBottom: '15px',
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        },
        [theme.breakpoints.up(900)]: {
            float: 'left',
            width: '49%',
        }
    },
    cardMediaFirst: {
        height: '300px',
        [theme.breakpoints.up(900)]: {
            height: '500px'
        }
    },
    cardMedia: {
        height: '300px',
        [theme.breakpoints.up(900)]: {
            minHeight: '300px',
        }
    }
})