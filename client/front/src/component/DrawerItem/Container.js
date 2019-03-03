// @flow
import { connect } from 'react-redux';
import DrawerItem from './DrawerItem';
import type { 
    Menu,
    State
} from '../../flowtype';

const mapStateToProps = (state: State, ownProps: { menu : Menu }): Object => {
    const menus = [ ...state.app.data.get.menus.data ];
    const childIDs = (ownProps.menu.children || []).map(child => child.uid);
    const childMenus = menus.filter(menu => childIDs.includes(menu.uid));
    return {
        childMenus,
        ...ownProps
    }
};

export default connect(mapStateToProps)(DrawerItem);