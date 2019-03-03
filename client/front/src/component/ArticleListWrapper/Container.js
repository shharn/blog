// @flow
import Component from './ArticleListWrapper';
import { connect } from 'react-redux';
import type { State } from '../../flowtype';

const mapStateToProps = (state: State): Object => ({
        isAuthenticated: state.app.auth.isAuthenticated
});

export default connect(mapStateToProps)(Component);