// @flow
import Home from './Home';
import { connect } from 'react-redux';
import { validateToken } from '../../action/auth';
import type { StoreState } from '../../';
import type { Dispatch } from '../../action/types';

const mapStateToProps = (state: StoreState): Object => ({
    isAuthenticated: state.app.auth.isAuthenticated
});

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    authenticate: (token: string) => dispatch(validateToken(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home)