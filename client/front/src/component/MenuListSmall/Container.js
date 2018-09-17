import { connect } from 'react-redux';
import MenuListSmall from './MenuListSmall';
import { switchMenuManagerChildComponent, setDataForCreateOrEditMenu } from '../../action/ui';
import { MenuManagerChildComponentType } from '../../constant';

import type { 
    Menu
} from '../../flowtype';
import type {
    StoreState
} from '../../';
import type {
    Dispatch
} from '../../action/types';



const mapStateToProps = (state: StoreState) => {
    const menus = [ ...state.app.data.get.menus.data ];
    return {
        menus
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    switchToEditMenu: (menu: Menu) => {
        dispatch(switchMenuManagerChildComponent(MenuManagerChildComponentType.EDIT_MENU));
        dispatch(setDataForCreateOrEditMenu(true, menu));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuListSmall);