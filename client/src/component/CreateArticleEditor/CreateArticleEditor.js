import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js'
import URLDialog from '../CreatArticleURLDialog';
import EditorButtonGroups from '../EditorButtonGroups';
import keycode from 'keycode';
import './styles.css';

class CreateArticleEditor extends Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty()};
        this.onChange = (editorState) => this.setState({editorState});
        this.onBlockStyleToggle = this.onBlockStyleToggle.bind(this);
        this.onInlineStyleToggle = this.onInlineStyleToggle.bind(this);
        this.onEditorClick = this.onEditorClick.bind(this);
        this.onLinkClick = this.onLinkClick.bind(this);
        this.onImageClick = this.onImageClick.bind(this);
        this.keyBindingFn = this.keyBindingFn.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.blockStyleFn = this.blockStyleFn.bind(this);
    }

    keyBindingFn(e: SyntheticKeyboardEvent): string {
        if (e.ctrlKey) {
            switch (e.keyCode) {
                case keycode('q'): return 'header-one';
                case keycode('w'): return 'header-two';
                case keycode('e'): return 'blockquote';
                case keycode('a'): return 'unordered-list-item';
                case keycode('s'): return 'ordered-list-item';
                case keycode('d'): return 'code-block';
                case keycode('b'): return 'BOLD';
                case keycode('i'): return 'ITALIC';
                case keycode('u'): return 'UNDERLINE';
                // case keycode('l'): return 'make-link';
                // case keycode('m'): return 'make-image';
                default: break;
            }
        }
        return getDefaultKeyBinding(e);
    }

    handleKeyCommand(command: string): DraftHandleValue {
        switch (command) {
            case 'header-one':
            case 'header-two':
            case 'blockquote':
            case 'unordered-list-item':
            case 'ordered-list-item':
            case 'code-block':
                this.onBlockStyleToggle(command);
                return 'handled';
            case 'BOLD':
            case 'ITALIC':
            case 'UNDERLINE':
                this.onInlineStyleToggle(command);
                return 'handled';
            // case 'make-link':
            //     return 'handled';
            // case 'make-image':
            //     return 'handled';
            default:
                return 'not-handled';
        }
    }

    blockStyleFn(block) {
        switch (block.getType()) {
            case 'code-block': return 'editor-codeblock';
            default: return null;
        }
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

    onEditorClick() {
        this.refs.editor.focus();
    }

    onLinkClick(e) {

    }

    onImageClick(e) {

    }

    confirmLink(url) {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            { url }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
        this.setState({
            editorState: RichUtils.toggleLink(
                newEditorState,
                newEditorState.getSelection(),
                entityKey
            ),
            showURLDialog: false,
        }, () => {
            setTimeout(() => this.refs.editor.focus(), 0);
        });
    }

    removeLink(e) {
        e.preventDefault();
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            this.setState({
                editorState: RichUtils.toggleLink(editorState, selection, null)
            });
        }
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
        const { editorState, showURLDialog } = this.state;
        return (
            <div className="editor-root">
                <div>Content</div>
                <div className="content-border">
                    <EditorButtonGroups 
                        onBlockStyleToggle={this.onBlockStyleToggle} 
                        onInlineStyleToggle={this.onInlineStyleToggle}
                        onLinkClick={this.onLinkClick}
                        onImageClick={this.onImageClick}
                        editorState={editorState}
                    />
                    <div className="editor" onClick={this.onEditorClick}>
                        <Editor 
                            blockStyleFn={this.blockStyleFn}
                            keyBindingFn={this.keyBindingFn}
                            handleKeyCommand={this.handleKeyCommand}
                            ref="editor" 
                            editorState={this.state.editorState} 
                            onChange={this.onChange} 
                            placeholder="Enjoy your ideas :)"/>
                    </div>
                </div>
                <URLDialog 
                    showURLDialog={showURLDialog} 
                    disableDialog={this.disableDialog} 
                    onConfirm={this.confirmLink}
                />
            </div>
        );
    }
}

export default CreateArticleEditor; 