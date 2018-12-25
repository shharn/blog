import { Styles } from '../../constant';

export default theme => ({
    content: {
        position: 'relative',
        width: '100%',
        padding: theme.spacing.unit * 2,
        height: 'auto',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
          height: 'calc(100vh - 64px)',
          marginTop: 64,
          marginLeft: Styles.drawerWidth
        }
      }
});