import React, { Component } from 'react';
import {Editor, EditorState} from 'draft-js'

class CreateArticleEditor extends Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty()};
        this.onChange = (editorState) => this.setState({editorState});
    }

    render() {
        return (
            <Editor editorStore={this.state.editorState} onChange={this.onChange}/>
        );
    }
}

export default CreateArticleEditor;