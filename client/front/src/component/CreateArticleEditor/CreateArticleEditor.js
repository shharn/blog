import React, { Component } from 'react';
import { 
    Editor, 
    EditorState, 
    RichUtils, 
    AtomicBlockUtils,
    getDefaultKeyBinding,
    CompositeDecorator,
    convertToRaw,
    convertFromRaw,
} from 'draft-js'
import URLDialog from '../CreatArticleURLDialog';
import ImageDialog from '../CreateArticleImageDialog';
import EditorButtonGroups from '../EditorButtonGroups';
import EditorContentImage from '../EditorContentImage';
import LinkText from './LinkText';
import keycode from 'keycode';
import className from 'classnames';
import './styles.css';

const IMAGE_BASE_URL = '/image';

function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        character => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

class CreateArticleEditor extends Component {
    constructor(props) {
        super(props);

        const decorator = new CompositeDecorator([
            {
                strategy: findLinkEntities,
                component: LinkText
            },
        ]);

        let editorState; 
        if (this.props.isEditMode) {
            try {
                const parsedContent = JSON.parse(this.props.content);
                const contentFromRaw = convertFromRaw(parsedContent);
                editorState = EditorState.createWithContent(contentFromRaw, decorator);
            } catch (ex) {
                editorState = EditorState.createEmpty(decorator);
            }
        } else {
            editorState = EditorState.createEmpty(decorator);
        }

        this.state = { 
            editorState,
            showURLDialog: false,
            showImageDialog: false
        };

        this.onChange = (editorState) => this.setState({editorState});
        this.onBlockStyleToggle = this.onBlockStyleToggle.bind(this);
        this.onInlineStyleToggle = this.onInlineStyleToggle.bind(this);
        this.onEditorClick = this.onEditorClick.bind(this);
        this.onLinkClick = this.onLinkClick.bind(this);
        this.onImageClick = this.onImageClick.bind(this);
        this.keyBindingFn = this.keyBindingFn.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.blockStyleFn = this.blockStyleFn.bind(this);
        this.blockRenderer = this.blockRenderer.bind(this);
        this.disableURLDialog = this.disableURLDialog.bind(this);
        this.disableImageDialog = this.disableImageDialog.bind(this);
        this.confirmLink = this.confirmLink.bind(this);
        this.confirmImage = this.confirmImage.bind(this);
        this.getContent = this.getContent.bind(this);
        this.shouldPlaceholderHide = this.shouldPlaceholderHide.bind(this);
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
                case keycode('l'): return 'make-link';
                case keycode('m'): return 'make-image';
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
            case 'make-link':
                this.onLinkClick();
                return 'handled';
            case 'make-image':
                this.onImageClick();
                return 'handled';
            default:
                return 'not-handled';
        }
    }

    blockStyleFn(block) {
        switch (block.getType()) {
            case 'code-block': 
                return 'editor-codeblock';
            default: 
                return null;
        }
    }

    blockRenderer(block) {
        switch (block.getType()) {
            case 'atomic':
                return {
                    component: EditorContentImage,
                    editable: false
                };
            default:
                return null;
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
        const { showURLDialog, editorState } = this.state;
        const selection = editorState.getSelection();
        if (selection.isCollapsed()) {
            return;
        }

        if (RichUtils.currentBlockContainsLink(editorState)) {
            this.setState({
                editorState: RichUtils.toggleLink(editorState, selection, null)
            });
        } else {
            this.setState({
                showURLDialog: !showURLDialog
            });
        }
    }

    onImageClick(e) {
        const { showImageDialog } = this.state;
        this.setState({
            showImageDialog: !showImageDialog
        });
    }

    confirmImage(files) {
        let { editorState: newEditorState } = this.state;
        for (let file of files) {
            const contentState = newEditorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(
                'image',
                'IMMUTABLE',
                { src: `${IMAGE_BASE_URL}/${file.name}` }
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            newEditorState = EditorState.set(
                newEditorState,
                { currentContent: contentStateWithEntity }
            );

            newEditorState = AtomicBlockUtils.insertAtomicBlock(
                newEditorState,
                entityKey,
                ' '
            );
        }

        this.setState({
            editorState: newEditorState
        }, () => {
            setTimeout(() => this.refs.editor.focus(), 0);
        });
    }

    disableURLDialog() {
        this.setState({
            showURLDialog: false
        });
    }

    disableImageDialog() {
        this.setState({
            showImageDialog: false
        });
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

    getContent() {
        const content = this.state.editorState.getCurrentContent();
        const rawContent = convertToRaw(content);
        return rawContent;
    }

    shouldPlaceholderHide() {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        return !contentState.hasText() && 
            contentState.getBlockMap().first().getType() !== 'unstyled';
    }

    render() {
        const { editorState, showURLDialog, showImageDialog } = this.state;
        const cn = className('editor', { hidePlaceholder: this.shouldPlaceholderHide()} );
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
                    <div className={cn} onClick={this.onEditorClick}>
                        <Editor 
                            blockStyleFn={this.blockStyleFn}
                            blockRendererFn={this.blockRenderer}
                            keyBindingFn={this.keyBindingFn}
                            handleKeyCommand={this.handleKeyCommand}
                            ref="editor" 
                            editorState={editorState} 
                            onChange={this.onChange} 
                            placeholder="Enjoy your ideas :)"/>
                    </div>
                </div>
                <URLDialog 
                    showURLDialog={showURLDialog} 
                    disableDialog={this.disableURLDialog} 
                    onConfirm={this.confirmLink}
                />
                <ImageDialog
                    showImageDialog={showImageDialog}
                    disableDialog={this.disableImageDialog}
                    onConfirm={this.confirmImage}
                />
            </div>
        );
    }
}

export default CreateArticleEditor; 