// @flow
import { connect} from 'react-redux';
import CreateOrEditMenu from './CreateOrEditMenu';
import {
    requestData,
    requestDataMutation,
    initializeMutationStatus
} from '../../action/data';
import { MutationOperationType } from '../../constant';
import type { 
    Menu,
    State,
    Dispatch
} from '../../flowtype';

const emptyMenu: Menu = {
    uid: '0',
    name: 'None',
};

const mapStateToProps = (state: State, ownProps: { switchToList: () => void }): Object => {
    const menus = [ ...state.app.data.get.menus.data ];
    menus.splice(0, 0, emptyMenu);
    const { isEditMode, menu } = state.app.ui.createOrEditMenu;
    const mutationType = isEditMode === true ? MutationOperationType.UPDATE : MutationOperationType.CREATE;
    const { status, isFetching } = state.app.data.mutation.menus[mutationType];
    return {
        isEditMode,
        menu,
        menus,
        status,
        isFetching,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    getMenus : (): void => dispatch(requestData('menus')),
    createMenu: (menu: Menu): void => dispatch(requestDataMutation(MutationOperationType.CREATE ,menu, 'menus')),
    updateMenu: (menu: Menu): void => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, 'menus')),
    initializeStatus: (): void => {
        dispatch(initializeMutationStatus('menus', MutationOperationType.CREATE));
        dispatch(initializeMutationStatus('menus', MutationOperationType.UPDATE));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrEditMenu);