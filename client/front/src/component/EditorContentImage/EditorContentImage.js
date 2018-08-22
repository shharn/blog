import React, { Component } from 'react';

class EditorContentImage extends Component {
    render() {
        const first = this.props.block.getEntityAt(0);
        const entity = this.props.contentState.getEntity(first);
        const { src } = entity.getData();
        const splitted = src.split('/');
        const alt = splitted[splitted.length - 1].split('.')[0];
        return (
            <img src={src} alt={alt} style={{ whiteSpace: 'initial', width: '100%'}}/>
        );
    }
}

export default EditorContentImage;