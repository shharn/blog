// @flow
import { connect } from 'react-redux';
import MenuManagerTableCell from './MenuManagerTableCell';
import { requestDataMutation } from '../../action/data';
import { disableEditableCell, changeToEditableCell } from '../../action/ui';
import { MutationOperationType, DataName } from '../../constant';

import type { 
    Menu
} from '../../flowtype';
import type {
    StoreState
} from '../../';
import type {
    Dispatch
} from '../../action/types';

const mapStateToProps = (state: StoreState, ownProps: { menu: Menu, cellName: string }) => {
    const { isEditable, editableRowId, editableCellName } = state.app.ui.menuList;
    const { menu, cellName } = ownProps;
    return {
        isEditable: isEditable && editableRowId === menu.uid && editableCellName === cellName,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeEditableCell: (rowId: number, cellName: string) => dispatch(changeToEditableCell(rowId, cellName)),
    disableEditableCell: () => dispatch(disableEditableCell()),
    updateMenu: (menu: Menu) => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, DataName.MENU))
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerTableCell);
