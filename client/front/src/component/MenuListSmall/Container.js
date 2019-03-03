import { connect } from 'react-redux';
import MenuListSmall from './MenuListSmall';
import { switchMenuManagerChildComponent, setDataForCreateOrEditMenu } from '../../action/ui';
import { MenuManagerChildComponentType } from '../../constant';
import type { 
    Menu,
    State,
    Dispatch
} from '../../flowtype';

const mapStateToProps = (state: State): Object => {
    const menus = [ ...state.app.data.get.menus.data ];
    return {
        menus
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    switchToEditMenu: (menu: Menu) => {
        dispatch(switchMenuManagerChildComponent(MenuManagerChildComponentType.EDIT_MENU));
        dispatch(setDataForCreateOrEditMenu(true, menu));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuListSmall);