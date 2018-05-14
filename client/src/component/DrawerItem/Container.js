import { connect } from 'react-redux';
import DrawerItem from './DrawerItem';

const mapStateToProps = (state, ownProps) => {
    const menus = state.app.data.get.menus.data;
    const childIDs = (ownProps.menu.children || []).map(child => child.id);
    const childMenus = menus.filter(menu => childIDs.includes(menu.id));
    return {
        childMenus,
        ...ownProps
    }
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerItem);