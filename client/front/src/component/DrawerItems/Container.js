// @flow
import { connect } from 'react-redux';
import DrawerItems from './DrawerItems';
import {  requestData } from '../../action/data';

import type {
    StoreState
} from '../../';
import type {
    Dispatch
} from '../../action/types';

const mapStateToProps = (state: StoreState) => {
    const { data, error, fetchStatus } =   { ...state.app.data.get.menus };
    return {
        menus: data,
        error,
        fetchStatus
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    requestMenuData: () => dispatch(requestData('menus'))
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerItems);