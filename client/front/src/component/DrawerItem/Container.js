// @flow
import { connect } from 'react-redux';
import DrawerItem from './DrawerItem';

import type {
    StoreState
} from '../../';
import type {
    Menu
} from '../../flowtype';

const mapStateToProps = (state: StoreState, ownProps: { menu : Menu }) => {
    const menus = [ ...state.app.data.get.menus.data ];
    const childIDs = (ownProps.menu.children || []).map(child => child.uid);
    const childMenus = menus.filter(menu => childIDs.includes(menu.uid));
    return {
        childMenus,
        ...ownProps
    }
};

export default connect(mapStateToProps)(DrawerItem);