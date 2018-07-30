import Component from './PrivateRoute';
import{ connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
    isAuthenticated: state.app.auth.isAuthenticated,
    ...ownProps
})

export default connect(mapStateToProps)(Component);