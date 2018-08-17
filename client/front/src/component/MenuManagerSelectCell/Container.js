import { connect } from 'react-redux';
import MenuManagerSelectCell from './MenuManagerSelectCell';
import { 
    requestDataMutation
} from '../../action/data';
import {
    MutationOperationType,
    DataName,
    Token
} from '../../constant';
import LocalStorage from 'local-storage';

import type { Menu } from '../../flowtype';

const emptyMenu = {
    uid: '0',
    name: 'None',
};

const mapStateToProps = (state, ownProps) => {
    const menus = [ ...state.app.data.get.menus.data ].filter(menu => menu.uid !== ownProps.menu.uid);
    menus.splice(0, 0, emptyMenu);
    return {
        menus,
        ...ownProps
    };
};

const mapDispatchToProps = dispatch => {
    const clientToken = LocalStorage.get(Token.key);
    return {
        updateMenu: (menu: Menu) => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, DataName.MENU, clientToken)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerSelectCell);