import { connect } from 'react-redux'
import MenuListSmall from './MenuListSmall'

import type { Menu } from '../../flowtype'

const mapStateToProps = (state, ownProps) => {
    const { data } = state.app.data.get.menus
    return {
        menus: Object.keys(data).map(key => data[key])
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuListSmall)