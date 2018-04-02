import { connect } from 'react-redux';
import DrawerItem from './DrawerItem';

const mapStateToProps = (state, ownProps) => {
    const menus = state.app.data.get.menus.data;
    const { childrenIDs } = ownProps.menu;
    const filteredIDs = Object.keys(menus).filter(id => childrenIDs.includes(parseInt(id, 10)));
    const children = filteredIDs.map(id => menus[id]);
    return {
        children,
        ...ownProps
    }
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerItem);