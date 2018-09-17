// @flow
import * as React from 'react';
import LooksOne from '@material-ui/icons/LooksOne';
import LooksTwo from '@material-ui/icons/LooksTwo';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import FormatQuote from '@material-ui/icons/FormatQuote';
import Code from '@material-ui/icons/Code';
import EditorStyleButton from './EditorStyleButton';

import type {
    WithStylesProps
} from '../../flowtype';
// import type {
//     Componen
// } from 'react';

const BLOCK_TYPES: Array<{ 
    icon: React.ComponentType<any>,
    style: string 
}> = [
    {icon: LooksOne, style: 'header-one'},
    {icon: LooksTwo, style: 'header-two'},
    {icon: FormatQuote, style: 'blockquote'},
    {icon: FormatListBulleted, style: 'unordered-list-item'},
    {icon: FormatListNumbered, style: 'ordered-list-item'},
    {icon: Code, style: 'code-block'},
  ];

type Props = {
    editorState: any
};

class BlockStyleButtons extends React.Component<Props & WithStylesProps> {
    render = () => {
        const { classes, editorState } = this.props;
        const selection = editorState.getSelection();
        const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();

        return (
            <span className={classes.container}>
                {BLOCK_TYPES.map(type => 
                    <EditorStyleButton 
                        key={`blockButton::${type.style}`} 
                        active={type.style === blockType} 
                        icon={type.icon} 
                        style={type.style} 
                        onToggle={this.props.onToggle}/>
                )}
            </span>
        );
    }
}

export default BlockStyleButtons;