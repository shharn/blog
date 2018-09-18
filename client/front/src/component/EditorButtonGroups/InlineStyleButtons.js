// @flow
import * as React from 'react';
import Bold from '@material-ui/icons/FormatBold';
import Italic from '@material-ui/icons/FormatItalic';
import Underline from '@material-ui/icons/FormatUnderlined';
import EditorStyleButton from './EditorStyleButton';
import type { WithStylesProps } from '../../flowtype';

const INLINE_STYLES: Array<{
    icon: React.ComponentType<any>,
    style: string
}> = [
    {icon: Bold, style: 'BOLD'},
    {icon: Italic, style: 'ITALIC'},
    {icon: Underline, style: 'UNDERLINE'}
  ];

type Props = {
    editorState: any
};

class InlineStyleButtons extends React.Component<Props & WithStylesProps> {
    render = () => {
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