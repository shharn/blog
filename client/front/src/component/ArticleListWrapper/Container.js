// @flow
import Component from './ArticleListWrapper';
import { connect } from 'react-redux';

import type {
    StoreState
} from '../../';

const mapStateToProps = (state: StoreState) => ({
        isAuthenticated: state.app.auth.isAuthenticated
});

export default connect(mapStateToProps)(Component);