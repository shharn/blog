import { Styles } from '../../constant';

function arrowPopperGenerator(color) {
  return {
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.95em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${color} transparent`
      }
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.95em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${color} transparent transparent transparent`
      }
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.95em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${color} transparent transparent`
      }
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.95em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${color}`
      }
    }
  };
}

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
  toggleButton: {
    color: 'rgba(0, 0, 0, 0.40)',
    minWidth: 0
  },
  tooltipArrow: {
    position: 'absolute',
    fontSize: 6,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    }
  },
  arrowPopper: arrowPopperGenerator(theme.palette.grey[700])
});