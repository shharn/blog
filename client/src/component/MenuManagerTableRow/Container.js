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
        deleteMenu: (id: number) => dispatch(requestDataMutation(MutationOperationType.DELETE, id, DataName.MENU, clientToken))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerTableRow);