import React, { Component } from 'react';
import LooksOne from '@material-ui/icons/LooksOne';
import LooksTwo from '@material-ui/icons/LooksTwo';
import Looks3 from '@material-ui/icons/Looks3';
import Looks4 from '@material-ui/icons/Looks4';
import Looks5 from '@material-ui/icons/Looks5';
import Looks6 from '@material-ui/icons/Looks6';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import FormatQuote from '@material-ui/icons/FormatQuote';
import Code from '@material-ui/icons/Code';
import EditorStyleButton from './EditorStyleButton';

const BLOCK_TYPES = [
    {icon: LooksOne, style: 'header-one'},
    {icon: LooksTwo, style: 'header-two'},
    {icon: Looks3, style: 'header-three'},
    {icon: Looks4, style: 'header-four'},
    {icon: Looks5, style: 'header-five'},
    {icon: Looks6, style: 'header-six'},
    {icon: FormatQuote, style: 'blockquote'},
    {icon: FormatListBulleted, style: 'unordered-list-item'},
    {icon: FormatListNumbered, style: 'ordered-list-item'},
    {icon: Code, style: 'code-block'},
  ];

class BlockStyleButtons extends Component {
    render() {
        const { classes } = this.props;
        return (
            <span className={classes.container}>
                {BLOCK_TYPES.map(type => <EditorStyleButton key={`blockButton::${type.style}`} icon={type.icon} style={type.style} onToggle={this.props.onToggle}/>)}
            </span>
        );
    }
}

export default BlockStyleButtons;