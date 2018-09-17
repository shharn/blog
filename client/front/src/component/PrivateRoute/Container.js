// @flow
import Component from './PrivateRoute';
import{ connect } from 'react-redux';
import type {
    StoreState 
} from '../../';
import type {
    ComponentType
} from 'react';

const mapStateToProps = (state: StoreState, ownProps: { component: ComponentType<*> }) => ({
    isAuthenticated: state.app.auth.isAuthenticated,
    ...ownProps
})

export default connect(mapStateToProps)(Component);