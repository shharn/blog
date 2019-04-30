// @flow
import Component from './TopBar';
import { connect } from 'react-redux';
import { requestLogout } from '../../action/auth';
import type { Dispatch } from '../../action/types';

type OwnProps = {
    isAuthenticated: boolean,
    toggleDrawer: () => void,
    openLoginModal: () => void
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout: (): void => dispatch(requestLogout())
});

export default connect(null, mapDispatchToProps)(Component);