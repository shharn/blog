import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class EditorStyleButton extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        e.preventDefault();
        this.props.onToggle(this.props.style);
    }

    render() {
        const { icon: Icon, active } = this.props;
        let className = 'editor-button';
        if (active) {
            className += ' active-button';
        }
        return (
            <Button mini onMouseDown={this.onClick} className={className}>
                {React.createElement(Icon)}
            </Button>
        );
    }
}

export default EditorStyleButton;