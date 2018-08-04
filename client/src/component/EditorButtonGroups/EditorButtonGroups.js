import React, { Component } from 'react';
import BlockStyleButtons from './BlockStyleButtons';
import InlineStyleButtons from './InlineStyleButtons';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

type Props = {
    editorState: any,
    onBlockStyleToggle: (e: SyntheticEvent) => void,
    onInlineStyleToggle: (e: SyntheticEvent) => void
}

class EditorButtonGroups extends Component<Props> {
    render() {
        const { editorState, onBlockStyleToggle, onInlineStyleToggle, classes } = this.props;
        return (
            <div className={classes.root}>
                <BlockStyleButtons classes={{ container: classes.buttonContainer }} editorState={editorState} onToggle={onBlockStyleToggle}/>
                <InlineStyleButtons classes={{ container: classes.buttonContainer}} editorState={editorState} onToggle={onInlineStyleToggle}/>
            </div>
        );
    }
}

export default withStyles(styles)(EditorButtonGroups);