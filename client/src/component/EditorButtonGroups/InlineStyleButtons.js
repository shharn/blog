import React, { Component } from 'react';
import Bold from '@material-ui/icons/FormatBold';
import Italic from '@material-ui/icons/FormatItalic';
import Underline from '@material-ui/icons/FormatUnderlined';
import Monospace from '@material-ui/icons/InsertComment';
import EditorStyleButton from './EditorStyleButton';

var INLINE_STYLES = [
    {icon: Bold, style: 'BOLD'},
    {icon: Italic, style: 'ITALIC'},
    {icon: Underline, style: 'UNDERLINE'},
    {icon: Monospace, style: 'CODE'},
  ];

class InlineStyleButtons extends Component {
    render() {
        const { classes } = this.props;
        return (
            <span className={classes.container}>
                {INLINE_STYLES.map(type => <EditorStyleButton key={`inlineButton:${type.style}`} icon={type.icon} style={type.style} onToggle={this.props.onToggle}/>)}
            </span>
        );
    }
}

export default InlineStyleButtons;