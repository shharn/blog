// @flow
import { connect} from 'react-redux';
import CreateOrEditMenu from './CreateOrEditMenu';
import {
    requestData,
    requestDataMutation,
    changeMutationStatus
} from '../../action/data';
import { MutationOperationType, FetchStatus } from '../../constant';

import type {
    StoreState
} from '../../';
import type {
    Dispatch
} from '../../action/types';

const emptyMenu = {
    uid: '0',
    name: 'None',
};

const mapStateToProps = (state: StoreState, ownProps: { switchToList: () => void }) => {
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
    getMenus : () => dispatch(requestData('menus')),
    createMenu: menu => dispatch(requestDataMutation(MutationOperationType.CREATE ,menu, 'menus')),
    updateMenu: menu => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, 'menus')),
    initializeStatus: () => {
        dispatch(changeMutationStatus('menus', MutationOperationType.CREATE, FetchStatus.FETCH_INITIAL));
        dispatch(changeMutationStatus('menus', MutationOperationType.UPDATE, FetchStatus.FETCH_INITIAL));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrEditMenu);