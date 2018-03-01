import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui-icons/Settings';
import Dialog, {
    DialogTitle,
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

class MenuManager extends Component {
    state = {
        openDialog: false
    };

    handleButtonClick = () => {
        this.setState({
            openDialog: !this.state.openDialog
        });
    }

    handleDialogClose = () => {
        this.setState({
            openDialog: false
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <IconButton aria-label="Management" onClick={this.handleButtonClick}>
                    <Settings/> 
                </IconButton>
                <Dialog
                    open={this.state.openDialog}
                    onClose={this.handleDialogClose}
                    aria-labelledby="dialog-title"
                >
                    <DialogTitle id="dialog-title">Dialog Title :D</DialogTitle>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(MenuManager);