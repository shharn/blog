// @flow
import { connect } from 'react-redux';
import MenuManagerSelectCell from './MenuManagerSelectCell';
import { requestDataMutation } from '../../action/data';
import {
    MutationOperationType,
    DataName
} from '../../constant';
import type { 
    Menu,
    State,
    Dispatch
} from '../../flowtype';

const emptyMenu: Menu = {
    uid: '0',
    name: 'None',
};

const mapStateToProps = (state: State, ownProps: { menu: Menu }): Object => {
    const menus = [ ...state.app.data.get.menus.data ].filter(menu => menu.uid !== ownProps.menu.uid);
    menus.splice(0, 0, emptyMenu);
    return {
        menus,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    updateMenu: (menu: Menu) => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, DataName.MENU)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerSelectCell);