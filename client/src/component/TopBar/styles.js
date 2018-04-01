import { Styles } from '../../constant';

export default theme => ({
  appBar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
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
      marginLeft: '10px'
  }
})