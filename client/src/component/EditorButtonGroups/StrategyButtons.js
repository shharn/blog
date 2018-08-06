import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import InsertLink from '@material-ui/icons/InsertLink';
import InsertPhoto from '@material-ui/icons/InsertPhoto';

class StrategyButtons extends Component {
    constructor(props) {
        super(props);
        this.onLinkClick = this.onLinkClick.bind(this);
        this.onImageClick = this.onImageClick.bind(this);
    }
    
    onLinkClick() {
        this.props.onLinkClick();
    }

    onImageClick() {
        this.props.onImageClick();
    }

    render() {
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