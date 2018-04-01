import { connect} from 'react-redux';
import ResponsiveDrawer from './ResponsiveDrawer';

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.app.auth.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveDrawer);