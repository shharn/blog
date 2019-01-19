// @flow
import Component from './Article';
import { connect } from 'react-redux';
import { setData } from '../../action/data';

import type { Article } from '../../flowtype';
import type { Dispatch} from '../../action/types';

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    setArticle: (article: Article) => dispatch(setData('article', article))
});

export default connect(undefined, mapDispatchToProps)(Component);