import { connect } from 'react-redux';
import MenuListSmall from './MenuListSmall';
import { switchMenuManagerChildComponent, setDataForCreateOrEditMenu } from '../../action/ui';
import { MenuManagerChildComponentType } from '../../constant';

import type { Menu } from '../../flowtype';

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.get.menus;
    return {
        menus: Object.values(data),
        ...ownProps
    };
};

const mapDispatchToProps = dispatch => ({
    switchToEditMenu: (menu: Menu) => {
        dispatch(switchMenuManagerChildComponent(MenuManagerChildComponentType.EDIT_MENU));
        dispatch(setDataForCreateOrEditMenu(true, menu));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuListSmall);