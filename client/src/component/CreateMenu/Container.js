import { connect} from 'react-redux';
import CreateMenu from './CreateMenu';

const emptyMenu = {
    id: -1,
    title: 'None',
}

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.get.menus;
    const menus = Object.keys(data).map(key => data[key]);
    menus.splice(0, 0, emptyMenu);
    return {
        ...ownProps,
        menus
    };
}

const mapDispatchToProps = dispatch => {

}

export default connect(mapStateToProps)(CreateMenu);