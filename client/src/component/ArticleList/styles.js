const firstBreakpoint = 950
const secondBreakpoint = 1450

export default theme => ({
    listContainer: {
        overflow: 'auto',
        display: 'grid',
        height: 'calc(100vh - 112px)',
        gridGap: '15px',
        padding: '2px',
        gridTemplateColumns: 'repeat(1, 1fr)',
        [theme.breakpoints.up(firstBreakpoint)]: {
            gridTemplateColumns: 'repeat(2, 1fr)',
        },
        [theme.breakpoints.up(secondBreakpoint)]: {
            gridTemplateColumns: 'repeat(3, 1fr)'
        }
    },
    article: {
        
    },
    articleImage: {
        height: '200px',
        [theme.breakpoints.up(750)]: {
            height: '300px'
        },
        [theme.breakpoints.up(850)]: {
            height: '350px'
        },
        [theme.breakpoints.up(firstBreakpoint)]: {
            height: '280px'
        },
        [theme.breakpoints.up(1240)]: {
            height: '340px'
        }
    }
});