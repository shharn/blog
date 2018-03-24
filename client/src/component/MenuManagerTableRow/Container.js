import { connect } from 'react-redux'
import MenuManagerTableRow from './MenuManagerTableRow'
import { requestDataMutation } from '../../action/data';
import { mutationOperationType, dataName, token } from '../../constant';
import LocalStorage from 'local-storage'

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = dispatch => {
    const clientToken = LocalStorage.get(token.key)
    return {
        deleteMenu: (id: number) => dispatch(requestDataMutation(mutationOperationType.DELETE, id, dataName.MENU, clientToken))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerTableRow)