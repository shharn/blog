import Component from './CreateArticleImageDialog';
import { connect } from 'react-redux';
import { 
    uploadImage,
    initializeImageDialogStatus
} from '../../action/data';

import type {
    StoreState
} from '../../';
import type {
    Dispatch 
} from '../../action/types';

const mapStateToProps = (state: StoreState, ownProps: { onConfirm: (files: Array<File>) => void }) => {
    const { progress, uploadStatus } = state.app.ui.imageDialog;
    return {
        ...ownProps,
        progress,
        uploadStatus
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        initializeStatus: () => dispatch(initializeImageDialogStatus()),
        uploadImage: files => dispatch(uploadImage(files))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);