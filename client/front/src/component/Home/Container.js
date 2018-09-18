// @flow
import Home from './Home';
import { connect } from 'react-redux';
import type { StoreState } from '../../';

const mapStateToProps = (state: StoreState): Object => ({
    isAuthenticated: state.app.auth.isAuthenticated
});

export default connect(mapStateToProps)(Home)