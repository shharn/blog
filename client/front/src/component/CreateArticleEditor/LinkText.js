// @flow
import * as React from 'react';

type Props = {
    contentState: any,
    entityKey: any,
    children?: React.Node
};

class LinkText extends React.Component<Props> {
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