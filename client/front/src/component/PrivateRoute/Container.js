// @flow
import Component from './PrivateRoute';
import{ connect } from 'react-redux';
import type { State } from '../../flowtype';
import type { ComponentType } from 'react';

const mapStateToProps = (state: State, ownProps: { component: ComponentType<*> }): Object=> ({
    isAuthenticated: state.app.auth.isAuthenticated,
    ...ownProps
})

export default connect(mapStateToProps)(Component);