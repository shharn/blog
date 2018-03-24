import { connect } from 'react-redux'
import MenuManagerSelectCell from './MenuManagerSelectCell'
import { 
    requestDataMutation
} from '../../action/data';
import {
    mutationOperationType,
    dataName,
    token
} from '../../constant';
import LocalStorage from 'local-storage'

import type { Menu } from '../../flowtype'

const emptyMenu = {
    id: -1,
    name: 'None',
}

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.get.menus
    const menus = Object.keys(data).map(key => data[key])
    menus.splice(0, 0, emptyMenu)
    return {
        menus,
        ...ownProps
    }
}

const mapDispatchToProps = dispatch => {
    const clientToken = LocalStorage.get(token.key)
    return {
        updateMenu: (menu: Menu) => dispatch(requestDataMutation(mutationOperationType.UPDATE, menu, dataName.MENU, clientToken)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerSelectCell)