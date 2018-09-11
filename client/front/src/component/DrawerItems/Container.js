import { connect } from 'react-redux';
import DrawerItems from './DrawerItems';
import {  requestData } from '../../action/data';

const mapStateToProps = (state, ownProps) => {
    const { data, error, fetchStatus } =   { ...state.app.data.get.menus };
    return {
        menus: data,
        error,
        fetchStatus
    };
};

const mapDispatchToProps = dispatch => ({
    requestMenuData: () => dispatch(requestData('menus'))
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerItems);