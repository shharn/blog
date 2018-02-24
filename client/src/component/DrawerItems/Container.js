import { connect } from 'react-redux';
import DrawerItems from './DrawerItems';
import {  requestData } from '../../action/data';

const mapStateToProps = (state, ownProps) => {
    const stateMenus = state.app.data.menus;
    const fetchComplete = stateMenus && (stateMenus.fetchComplete || null);
    const fetchStatus = stateMenus && (stateMenus.fetchStatus || null);
    const menus = stateMenus && (stateMenus.data || null);
    const error= stateMenus && (stateMenus.error || null);
    const result = {
        fetchComplete,
        fetchStatus,
        menus,
        error
    };
    return result;
};

const mapDispatchToProps = dispatch => ({
    requestMenuData: () => dispatch(requestData('menus'))
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerItems);