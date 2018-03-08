import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import SaveIcon from 'material-ui-icons/Save';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu'; 
import { withStyles } from 'material-ui/styles';
import styles from './styles';

class CreateMenu extends Component {
    state = {
        menuId: -1,
    }

    handleParentMenuChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const { toggleComponent, classes, menus } = this.props;
        return (
            <div className={classes.createMenuContainer}>
                <TextField className={classes.menuName} required label="Menu Name" margin="normal"/>
                <TextField className={classes.menuUrl} required label="Menu's URL" margin="normal"/>
                <div className={classes.dropboxContainer}>
                    <FormControl margin="normal" className={classes.formControl}>
                        <InputLabel htmlFor="parentMenu">Parent Menu</InputLabel>
                        <Select
                            value={this.state.menuId}
                            onChange={this.handleParentMenuChange}
                            inputProps={{
                                name: 'menuId',
                                id: 'parentMenu'
                            }}
                        >
                            {menus.map(menu => <MenuItem key={menu.id} value={menu.id}>{menu.title}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <div className={classes.buttonContainer}>
                    <IconButton className={classes.iconButton} aria-label="confirm" color="default">
                        <SaveIcon/>
                    </IconButton>
                    <IconButton className={classes.iconButton} aria-label="cancel" onClick={toggleComponent} color="default">
                        <ClearIcon/>
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CreateMenu);