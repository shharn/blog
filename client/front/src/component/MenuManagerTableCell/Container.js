// @flow
import { connect } from 'react-redux';
import MenuManagerTableCell from './MenuManagerTableCell';
import { requestDataMutation } from '../../action/data';
import { changeToEditableCell } from '../../action/ui';
import { MutationOperationType, DataName } from '../../constant';
import type { 
    Menu,
    State,
    Dispatch
} from '../../flowtype';

const mapStateToProps = (state: State, ownProps: { menu: Menu, cellName: string }): Object => {
    const { isEditable, editableRowId, editableCellName } = state.app.ui.menuList;
    const { menu, cellName } = ownProps;
    return {
        isEditable: isEditable && editableRowId === menu.uid && editableCellName === cellName,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    changeEditableCell: (rowId: number, cellName: string) => dispatch(changeToEditableCell(rowId, cellName)),
    updateMenu: (menu: Menu) => dispatch(requestDataMutation(MutationOperationType.UPDATE, menu, DataName.MENU))
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerTableCell);
