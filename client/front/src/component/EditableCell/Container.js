// @flow
import Component from './EditableCell';
import { connect } from 'react-redux';
import { disableEditableCell } from '../../action/ui';
import type { Dispatch } from '../../action/types';
import type { Mutation } from '../../reducer/data/mutation';

type OwnPropsTypes = {
    rowId: number,
    cellName: string,
    value: string,
    updateMenu: (cellName: string, value: string) => void,
}

const mapStateToProps = (state: State, ownProps: OwnPropsTypes): Object => {
    const updateMutationState: Mutation = state.app.data.mutation.menus.update;
    return {
        updateMutationState,
        ownProps
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => ({
    disableEditableCell: () => dispatch(disableEditableCell()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);