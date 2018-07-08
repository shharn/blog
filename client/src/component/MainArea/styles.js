import { Styles } from '../../constant';

export default theme => ({
    content: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
        padding: theme.spacing.unit * 3,
        height: `calc(100% - 56px)`,
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
          height: 'calc(100% - 64px)',
          marginTop: 64,
          marginLeft: Styles.drawerWidth
        }
      }
});