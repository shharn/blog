import { connect } from 'react-redux';
import MenuManagerTableRow from './MenuManagerTableRow';
import { requestDataMutation } from '../../action/data';
import { MutationOperationType, DataName, Token } from '../../constant';
import LocalStorage from 'local-storage';

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps
    };
};

const mapDispatchToProps = dispatch => {
    const clientToken = LocalStorage.get(Token.key);
    return {
        deleteMenu: (uid: string) => dispatch(requestDataMutation(MutationOperationType.DELETE, uid, DataName.MENU, clientToken))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerTableRow);