import { Styles } from '../../constant';

export default theme => ({
    content: {
        width: '100%',
        padding: theme.spacing.unit * 2,
        height: `calc(100vh - 56px)`,
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
          height: 'calc(100vh - 64px)',
          marginTop: 64,
          marginLeft: Styles.drawerWidth
        }
      }
});