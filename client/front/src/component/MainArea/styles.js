import { Styles } from '../../constant';

export default theme => ({
    main: {
        position: 'relative',
        width: '100%',
        padding: theme.spacing.unit * 2,
        height: 'auto',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
          height: 'calc(100vh - 64px)',
          width: 'calc(100% - 240px)',
          marginTop: 64,
          marginLeft: Styles.drawerWidth
        }
      },
});