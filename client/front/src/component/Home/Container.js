// @flow
import Home from './Home';
import { connect } from 'react-redux';
import type { 
    State,
    Dispatch
} from '../../flowtype';

const mapStateToProps = (state: State): Object => ({
    isAuthenticated: state.app.auth.isAuthenticated
});

export default connect(mapStateToProps)(Home)