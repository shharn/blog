const lastLayoutBreakpoint = 1550;
// const firstLayoutBreakpoint = 950
// const secondLayoutBreakpoint = 1450

export default theme => ({
    listContainer: {
        position: 'relative',
        overflow: 'auto',
        display: 'grid',
        maxHeight: 'calc(100vh - 160px)',
        gridGap: '15px',
        padding: '2px',
        gridTemplateColumns: 'repeat(1, 1fr)',
        [theme.breakpoints.up('lg')]: {
            gridTemplateColumns: 'repeat(2, 1fr)',
        },
        [theme.breakpoints.up(lastLayoutBreakpoint)]: {
            gridTemplateColumns: 'repeat(3, 1fr)'
        }
    },
    header: {
        margin: '15px 10px',
        color: 'rgba(0, 0, 0, 0.85)'
    },
    article: {
        height: '100%',
    },
    articleImage: {
        height: '52vw',
        [theme.breakpoints.up('sm')]: {
            height: '42vw'
        },
        [theme.breakpoints.up('lg')]: {
            height: '27vw'
        },
        [theme.breakpoints.up(lastLayoutBreakpoint)]: {
            height: '18vw'
        },
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