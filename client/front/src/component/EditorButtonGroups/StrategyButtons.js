// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import InsertLink from '@material-ui/icons/InsertLink';
import InsertPhoto from '@material-ui/icons/InsertPhoto';

import type {
    WithStylesProps
} from '../../flowtype';

type Props = {
    onLinkClick: () => void,
    onImageClick: () => void
}

class StrategyButtons extends Component<Props & WithStylesProps> {
    onLinkClick = (): void => {
        this.props.onLinkClick();
    }

    onImageClick = (): void => {
        this.props.onImageClick();
    }

    render = () => {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <Button mini className="editor-button" onClick={this.onLinkClick}>
                    <InsertLink/>
                </Button>
                <Button mini className="editor-button" onClick={this.onImageClick}>
                    <InsertPhoto/>
                </Button>
            </div>
        );
    }
}

export default StrategyButtons;