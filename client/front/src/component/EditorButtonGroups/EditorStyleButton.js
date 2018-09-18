// @flow
import * as React from 'react';
import Button from '@material-ui/core/Button';

type Props = {
    active: boolean,
    icon: React.ComponentType<any>,
    style: string,

    onToggle: (stye: string) => void
}

class EditorStyleButton extends React.Component<Props> {
    onClick = (e: SyntheticMouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        this.props.onToggle(this.props.style);
    }

    render = () => {
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