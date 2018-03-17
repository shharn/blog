import { connect} from 'react-redux'
import CreateMenu from './CreateMenu'
import {
    requestDataMutation
} from '../../action/data'
import { mutationOperationType, token} from '../../constant'
import LocalStorage from 'local-storage'

const emptyMenu = {
    id: -1,
    title: 'None',
}

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.get.menus
    const menus = Object.keys(data).map(key => data[key])
    menus.splice(0, 0, emptyMenu)
    const { status, isFetching } = state.app.data.mutation.menus[mutationOperationType.CREATE];
    return {
        ...ownProps,
        menus,
        status,
        isFetching
    }
}

const mapDispatchToProps = dispatch => ({
    createMenu: menu => dispatch(requestDataMutation(mutationOperationType.CREATE ,menu, 'menus', LocalStorage.get(token.key)))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateMenu);