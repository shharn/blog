// @flow
import { connect} from 'react-redux';
import ResponsiveDrawer from './ResponsiveDrawer';
import type { State } from '../../flowtype';

const mapStateToProps = (state: State) => {
    return {
        isAuthenticated: state.app.auth.isAuthenticated
    };
};

export default connect(mapStateToProps)(ResponsiveDrawer);