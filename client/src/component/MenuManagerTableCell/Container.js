import { connect } from 'react-redux'
import MenuManagerTableCell from './MenuManagerTableCell'
import { requestDataMutation } from '../../action/data'
import { disableEditableCell, changeToEditableCell } from '../../action/ui'
import { mutationOperationType, dataName, token } from '../../constant'
import LocalStorage from 'local-storage'

import type { Menu } from '../../flowtype'

const mapStateToProps = (state, ownProps) => {
    const { isEditable, editableRowId, editableCellName } = state.app.ui.menuManager
    const { menu, cellName } = ownProps
    return {
        isEditable: isEditable && editableRowId === menu.id && editableCellName === cellName,
        ...ownProps
    }
}

const mapDispatchToProps = dispatch => {
    const clientToken = LocalStorage.get(token.key)
    return {
        changeEditableCell: (rowId: number, cellName: string) => dispatch(changeToEditableCell(rowId, cellName)),
        disableEditableCell: () => dispatch(disableEditableCell()),
        updateMenu: (menu: Menu) => dispatch(requestDataMutation(mutationOperationType.UPDATE, menu, dataName.MENU, clientToken)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerTableCell)
