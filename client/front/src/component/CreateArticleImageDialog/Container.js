import Component from './CreateArticleImageDialog';
import { connect } from 'react-redux';
import { 
    uploadImage,
    initializeImageDialogStatus
} from '../../action/data';

const mapStateToProps = (state, ownProps) => {
    const { progress, uploadStatus } = state.app.ui.imageDialog;
    return {
        ...ownProps,
        progress,
        uploadStatus
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initializeStatus: () => dispatch(initializeImageDialogStatus()),
        uploadImage: files => dispatch(uploadImage(files))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);