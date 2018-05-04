// @flow
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from 'material-ui/TextField';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { LinearProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { FetchStatus } from '../../constant';
import styles from './styles';

import type { Menu } from '../../flowtype';

type Props = {
    history: any,
    classes: any,

    menus: Array<Menu>,
    status: $Values<FetchStatus>,
    isFetching: boolean,
    isEditMode: boolean,
    menu: Menu,
    
    switchToList: () => void,

    createMenu: (menu: Menu) => void,
    updateMenu: (menu: Menu) => void,
    initializeStatus: () => void
};

type State = {
    menuName: string,
    menuURL: string,
    parentMenuId: number
};

class CreateMenu extends Component<Props, State> {
    state = {
        menuName: this.props.isEditMode === true ? this.props.menu.name : '',
        menuURL: this.props.isEditMode === true ? this.props.menu.url : '',
        parentMenuId: this.props.isEditMode === true ? this.props.menu.parentId: -1,
    }

    componentDidUpdate() {
        this.props.status === FetchStatus.FETCH_SUCCESS && setTimeout(this.props.switchToList, 1000);
    }

    componentWillUnmount() {
        this.props.initializeStatus();
    }

    handleNameChange = event => {
        this.setState({ menuName: event.target.value });
    }

    handleURLChange = event => {
        this.setState({ menuURL: event.target.value });
    }

    handleParentMenuChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmitButtonClick = event => {
        const { menuName, menuURL, parentMenuId } = this.state;
        const { isEditMode, menu } = this.props;
        if (menuName.length < 1) {
            // set error message on TextField of Name
        } 
        if (menuURL.length < 1) {
            // set error message on TextField of URL
            
        }

        let data = {
            name: menuName,
            url: menuURL,
            parentId: parentMenuId
        };
        if (isEditMode) {
            data = { ...menu, ...data }
        }

        if (menuName.length > 0 && menuURL.length > 0) {
            isEditMode === true ? this.props.updateMenu(data) : this.props.createMenu(data);
        }
    }

    handleCancelButtonClick = event => {
        this.props.switchToList();
    }
    
    getExtraComponent = (isFetching: boolean, status: $Values<FetchStatus>) => {
        if (isFetching === true) {
            return <LinearProgress/>;
        }

        switch(status) {
            case FetchStatus.FETCH_SUCCESS:
                return <Typography variant="caption" style={{ color: 'green' }}>Success</Typography>;
            case FetchStatus.FETCH_FAIL:
                return <Typography variant="caption" color='error'>Failed</Typography>;
            default:
                return;
        }
    }

    render() {
        const { classes, menus, menu, isFetching, status } = this.props;
        return (
            <div className={classes.createMenuContainer}>
                <TextField className={classes.menuName} value={this.state.menuName} fullWidth={true} required label="Menu Name" margin="normal" onChange={this.handleNameChange}/>
                <TextField className={classes.menuUrl} value={this.state.menuURL} fullWidth={true} required label="Menu's URL" margin="normal" onChange={this.handleURLChange}/>
                <div className={classes.dropboxContainer}>
                    <FormControl margin="normal" className={classes.formControl}>
                        <InputLabel htmlFor="parentMenu">Parent Menu</InputLabel>
                        <Select
                            value={this.state.parentMenuId}
                            onChange={this.handleParentMenuChange}
                            inputProps={{
                                name: 'parentMenuId',
                                id: 'parentMenu'
                            }}
                        >
                            {menus.filter(item => item.id !== menu.id).map(menu => <MenuItem key={menu.id} value={menu.id}>{menu.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <div className={classes.footer}>
                    {this.getExtraComponent(isFetching, status)}
                    <div className={classes.buttonContainer}>
                        <IconButton className={classes.iconButton} aria-label="confirm" color="default" onClick={this.handleSubmitButtonClick}>
                            <SaveIcon/>
                        </IconButton>
                        <IconButton className={classes.iconButton} aria-label="cancel" onClick={this.handleCancelButtonClick} color="default">
                            <ClearIcon/>
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CreateMenu);