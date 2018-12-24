// @flow
import React, { Component } from 'react';

type Props = {
    block: any,
    contentState: any
};

class EditorContentImage extends Component<Props> {
    render = () => {
        const first = this.props.block.getEntityAt(0);
        const entity = this.props.contentState.getEntity(first);
        const { src } = entity.getData();
        const splitted = src.split('/');
        const alt = splitted[splitted.length - 1].split('.')[0];
        return (
            <img src={src} alt={alt} style={{ whiteSpace: 'initial', display: 'block', margin: '0 auto' }}/>
        );
    }
}

export default EditorContentImage;