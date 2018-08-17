import React, { Component } from 'react';
import BlockStyleButtons from './BlockStyleButtons';
import InlineStyleButtons from './InlineStyleButtons';
import StrategyButtons from './StrategyButtons';
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
                <StrategyButtons classes={{ container: classes.buttonContainer }} editorState={editorState} onLinkClick={this.props.onLinkClick} onImageClick={this.props.onImageClick} />
            </div>
        );
    }
}

export default withStyles(styles)(EditorButtonGroups);