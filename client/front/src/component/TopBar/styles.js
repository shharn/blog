import { Styles } from '../../constant';

export default theme => ({
  appBar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    cursor: 'auto',
    marginLeft: Styles.drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${Styles.drawerWidth}px)`
    }
  },
  toolBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 'inherit'
  },
  navHamburgerIcon: {
    color: theme.palette.common.white,
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  searchInput: {
      color: 'rgba(0, 0, 0, 0.40)',
      marginLeft: '10px',
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        width: '100px'
      }
  },
  buttonContainer: {
    marginLeft: '10px'
  },
  logoutButton: {
    color: 'rgba(0, 0, 0, 0.40)',
    minWidth: 0
  }
});