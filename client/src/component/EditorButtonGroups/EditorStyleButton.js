import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class EditorStyleButton extends Component {
    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(e) {
        e.preventDefault();
        this.props.onToggle(this.props.style);
    }

    render() {
        const { icon: Icon} = this.props;
        return (
            <Button mini onClick={this.onToggle} style={{ padding: '0 5px', minWidth: '0' }}>
                {React.createElement(Icon)}
            </Button>
        );
    }
}

export default EditorStyleButton;