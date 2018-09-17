// @flow
import { connect } from 'react-redux';
import MenuManagerTableRow from './MenuManagerTableRow';
import { requestDataMutation } from '../../action/data';
import { MutationOperationType, DataName } from '../../constant';
import type {
    Menu
} from '../../flowtype';
import type {
    StoreState
} from '../../';
import type {
    Dispatch
} from '../../action/types';

const mapStateToProps = (_: StoreState, ownProps: { menu: Menu }) => {
    return {
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    deleteMenu: (uid: string) => dispatch(requestDataMutation(MutationOperationType.DELETE, uid, DataName.MENU))
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerTableRow);