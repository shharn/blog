// @flow
import { connect } from 'react-redux';
import MenuManagerSelectCell from './MenuManagerSelectCell';
import { 
    requestDataMutation
} from '../../action/data';
import {
    MutationOperationType,
    DataName
} from '../../constant';

import type { 
    Menu
} from '../../flowtype';
import type {
    StoreState
} from '../../';
import type {
    Dispatch
} from '../../action/types';

const emptyMenu: Menu = {
    uid: '0',
    name: 'None',
};

const mapStateToProps = (state: StoreState, ownProps: { menu: Menu }) => {
    const menus = [ ...state.app.data.get.menus.data ].filter(menu => menu.uid !== ownProps.menu.uid);
    menus.splice(0, 0, emptyMenu);
    return {
        menus,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateMenu: (menu: Menu) => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, DataName.MENU)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerSelectCell);