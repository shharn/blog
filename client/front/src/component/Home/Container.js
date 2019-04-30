// @flow
import Home from './Home';
import { connect } from 'react-redux';
import type { 
    State,
    Dispatch
} from '../../flowtype';

const mapStateToProps = (state: State): Object => ({
    isAuthenticated: state.app.auth.isAuthenticated,
    admin: state.app.auth.admin
});

export default connect(mapStateToProps)(Home)