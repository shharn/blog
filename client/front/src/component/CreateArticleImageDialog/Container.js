import Component from './CreateArticleImageDialog';
import { connect } from 'react-redux';
import { 
    uploadImage,
    initializeImageDialogStatus
} from '../../action/data';
import type { StoreState } from '../../';
import type { Dispatch } from '../../action/types';

const mapStateToProps = (state: StoreState, ownProps: { onConfirm: (files: Array<File>) => void }): Object => {
    const { uploadStatus, error } = state.app.ui.imageDialog;
    return {
        ...ownProps,
        uploadStatus,
        error
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => {
    return {
        initializeStatus: () => dispatch(initializeImageDialogStatus()),
        uploadImage: files => dispatch(uploadImage(files))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);