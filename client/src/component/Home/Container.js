import Home from './Home';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => ({
    isAuthenticated: state.app.auth.isAuthenticated
});

export default connect(mapStateToProps, null)(Home)