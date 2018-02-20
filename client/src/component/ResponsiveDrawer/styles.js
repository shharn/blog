import { styles } from '../../constant';

export default theme => ({
    drawerPaper: {
        width: styles.drawerWidth,
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
            height: '100%'
        }
    }
})