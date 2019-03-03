// @flow
import { connect } from 'react-redux';
import MenuManagerTableRow from './MenuManagerTableRow';
import { requestDataMutation } from '../../action/data';
import { MutationOperationType, DataName } from '../../constant';
import type { 
    Menu,
    State,
    Dispatch
} from '../../flowtype';

const mapStateToProps = (_: State, ownProps: { menu: Menu }): Object => {
    return {
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    deleteMenu: (uid: string) => dispatch(requestDataMutation(MutationOperationType.DELETE, uid, DataName.MENU))
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerTableRow);