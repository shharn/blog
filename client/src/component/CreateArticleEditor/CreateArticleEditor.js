import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js'
import EditorButtonGroups from '../EditorButtonGroups';
import './styles.sass';

class CreateArticleEditor extends Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty()};
        this.onChange = (editorState) => this.setState({editorState});
        this.onBlockStyleToggle = this.onBlockStyleToggle.bind(this);
        this.onInlineStyleToggle = this.onInlineStyleToggle.bind(this);
    }

    onBlockStyleToggle(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    onInlineStyleToggle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    hasContent(): bool {
        const { editorState } = this.state;
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
            return true;
        } 
        return false;
        }
        return true;
    }

    render() {
        const { editorState } = this.state;
        return (
            <div className="editor-root">
                <div>Content</div>
                <EditorButtonGroups onBlockStyleToggle={this.onBlockStyleToggle} onInlineStyleToggle={this.onInlineStyleToggle} editorState={editorState}/>
                <div className="editor">
                    <Editor editorState={this.state.editorState} onChange={this.onChange} placeholder="Enjoy your ideas :)"/>
                </div>
            </div>
        );
    }
}

export default CreateArticleEditor;