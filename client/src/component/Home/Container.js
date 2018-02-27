import Home from './Home';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.app.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, null)(Home)