// @flow
import { connect} from 'react-redux';
import ResponsiveDrawer from './ResponsiveDrawer';
import type {
    StoreState 
} from '../../';

const mapStateToProps = (state: StoreState) => {
    return {
        isAuthenticated: state.app.auth.isAuthenticated
    };
};

export default connect(mapStateToProps)(ResponsiveDrawer);