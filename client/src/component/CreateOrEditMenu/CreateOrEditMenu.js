// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
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

class CreateOrEditMenu extends Component<Props, State> {
    state = {
        menuName: this.props.isEditMode === true ? this.props.menu.name : '',
        menuURL: this.props.isEditMode === true ? this.props.menu.url : '',
        parentMenuId: this.props.isEditMode === true ? this.props.menu.parent ? this.props.menu.parent.uid : '0' : '0',
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
            return;
        } 
        if (menuURL.length < 1) {
            // set error message on TextField of URL
            return;
        }

        // If no parent, should not include the parent property
        let data;
        if (isEditMode === true) {
            data = { ...menu, name: menuName, url: menuURL };
            if ( (!data.parent && parentMenuId !== '0') || (data.parent && data.parent[0].uid !== parentMenuId)) {
                data.parent = [ { uid: parentMenuId } ];
            } 
        } else {
            data = {
                name: menuName,
                url: menuURL
            };
            parentMenuId !== '0' && (data.parent = [  { uid: parentMenuId } ]);
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
        const { classes, menus, menu, isFetching, isEditMode, status } = this.props;
        const showableMenus = isEditMode === true ? menus.filter(item => item.uid === '0' || item.uid !== menu.uid) : menus;
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
                            {showableMenus.map(menu => <MenuItem key={menu.uid} value={menu.uid}>{menu.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <div className={classes.footer}>
                    {this.getExtraComponent(isFetching, status)}
                    <div className={classes.buttonContainer}>
                        <Button className={classes.iconButton} aria-label="confirm" color="default" onClick={this.handleSubmitButtonClick}>
                            <SaveIcon/>
                        </Button>
                        <Button className={classes.iconButton} aria-label="cancel" onClick={this.handleCancelButtonClick} color="default">
                            <ClearIcon/>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CreateOrEditMenu);