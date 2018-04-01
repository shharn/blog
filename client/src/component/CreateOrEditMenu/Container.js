import { connect} from 'react-redux'
import CreateOrEditMenu from './CreateOrEditMenu'
import {
    requestDataMutation,
    changeMutationStatus
} from '../../action/data'
import { MutationOperationType, FetchStatus, Token} from '../../constant'
import LocalStorage from 'local-storage'

const emptyMenu = {
    id: -1,
    name: 'None',
}

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.get.menus
    const menus = Object.keys(data).map(key => data[key])
    menus.splice(0, 0, emptyMenu)
    const { status, isFetching } = state.app.data.mutation.menus[MutationOperationType.CREATE];
    return {
        ...ownProps,
        menus,
        status,
        isFetching
    }
}

const mapDispatchToProps = dispatch => ({
    createMenu: menu => dispatch(requestDataMutation(MutationOperationType.CREATE ,menu, 'menus', LocalStorage.get(Token.key))),
    initializeStatus: () => dispatch(changeMutationStatus('menus', MutationOperationType.CREATE, FetchStatus.FETCH_INITIAL))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrEditMenu);