import Component from './TopBar';
import { connect } from 'react-redux';
import { requestLogout } from '../../action/auth';
import type { StoreState } from '../../';
import type { Dispatch } from '../../action/types';

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout: (token: string): void => dispatch(requestLogout(token))
});

export default connect(null, mapDispatchToProps)(Component);