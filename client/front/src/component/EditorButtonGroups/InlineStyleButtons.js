import React, { Component } from 'react';
import Bold from '@material-ui/icons/FormatBold';
import Italic from '@material-ui/icons/FormatItalic';
import Underline from '@material-ui/icons/FormatUnderlined';
import EditorStyleButton from './EditorStyleButton';

const INLINE_STYLES = [
    {icon: Bold, style: 'BOLD'},
    {icon: Italic, style: 'ITALIC'},
    {icon: Underline, style: 'UNDERLINE'}
  ];

class InlineStyleButtons extends Component {
    render() {
        const { classes, editorState } = this.props;
        const currentStyle = editorState.getCurrentInlineStyle();
        return (
            <span className={classes.container}>
                {INLINE_STYLES.map(type => 
                    <EditorStyleButton 
                        key={`inlineButton:${type.style}`} 
                        active={type.style === currentStyle}
                        icon={type.icon} 
                        style={type.style} 
                        onToggle={this.props.onToggle}/>)}
            </span>
        );
    }
}

export default InlineStyleButtons;