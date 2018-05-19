import { connect} from 'react-redux';
import CreateOrEditMenu from './CreateOrEditMenu';
import {
    requestDataMutation,
    changeMutationStatus
} from '../../action/data';
import { MutationOperationType, FetchStatus, Token } from '../../constant';
import LocalStorage from 'local-storage';

const emptyMenu = {
    uid: '0',
    name: 'None',
};

const mapStateToProps = (state, ownProps) => {
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

const mapDispatchToProps = dispatch => ({
    createMenu: menu => dispatch(requestDataMutation(MutationOperationType.CREATE ,menu, 'menus', LocalStorage.get(Token.key))),
    updateMenu: menu => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, 'menus', LocalStorage.get(Token.key))),
    initializeStatus: () => {
        dispatch(changeMutationStatus('menus', MutationOperationType.CREATE, FetchStatus.FETCH_INITIAL));
        dispatch(changeMutationStatus('menus', MutationOperationType.UPDATE, FetchStatus.FETCH_INITIAL));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrEditMenu);