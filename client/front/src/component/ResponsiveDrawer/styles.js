import { Styles } from '../../constant';

export default theme => ({
    drawerPaper: {
        width: Styles.drawerWidth,
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
            height: '100%'
        }
    }
});