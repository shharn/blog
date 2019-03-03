// @flow
import { connect } from 'react-redux';
import DrawerItems from './DrawerItems';
import { requestData } from '../../action/data';
import type { 
    State,
    Dispatch
} from '../../flowtype';

const mapStateToProps = (state: State): Object => {
    const { data, error, fetchStatus } =   { ...state.app.data.get.menus };
    return {
        menus: data,
        error,
        fetchStatus
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    requestMenuData: () => dispatch(requestData('menus'))
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerItems);