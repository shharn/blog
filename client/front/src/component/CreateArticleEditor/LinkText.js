import React, { Component } from 'react';

class LinkText extends Component {
    render() {
        const { contentState, entityKey } = this.props;
        const { url } = contentState.getEntity(entityKey).getData();
        return (
            <a href={url} className="editor-link_text">
                {this.props.children}
            </a>
        );
    }
}

export default LinkText;