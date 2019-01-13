export default theme => ({
    outerAnchor: {
        textDecoration: 'none',
        height: '350px',
        [theme.breakpoints.up(750)]: {
            height: '450px'
        },
        [theme.breakpoints.up(850)]: {
            height: '500px'
        },
        [theme.breakpoints.up(950)]: {

        }
    }
});