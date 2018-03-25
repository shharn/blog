// @flow
import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton'
import SaveIcon from 'material-ui-icons/Save'
import ClearIcon from 'material-ui-icons/Clear'
import TextField from 'material-ui/TextField'
import { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import { LinearProgress } from 'material-ui/Progress'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import { fetchStatus } from '../../constant'
import keycode from 'keycode'
import styles from './styles'

import type { Menu } from '../../flowtype'

type Props = {
    history: any,
    classes: any,

    menus: Array<Menu>,
    status: $Values<fetchStatus>,
    isFetching: boolean,
    
    toggleComponent: () => void,
    createMenu: (menu: Menu) => void,
    initializeStatus: () => void
}

type State = {
    menuName: string,
    menuURL: string,
    parentMenuId: number
}

class CreateMenu extends Component<Props, State> {
    state = {
        menuName: '',
        menuURL: '',
        parentMenuId: -1,
    }

    componentDidUpdate() {
        this.props.status === fetchStatus.FETCH_SUCCESS && setTimeout(this.props.toggleComponent, 1000)
    }

    componentWillUnmount() {
        this.props.initializeStatus()
    }

    handleKeyUp = e => {
        e.stopPropagation()
        if (e.keyCode === keycode('esc')) {
            this.props.toggleComponent()
        } 
    }

    handleNameChange = event => {
        this.setState({ menuName: event.target.value })
    }

    handleURLChange = event => {
        this.setState({ menuURL: event.target.value })
    }

    handleParentMenuChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmitButtonClick = event => {
        const { menuName, menuURL, parentMenuId } = this.state
        if (menuName.length < 1) {
            // set error message on TextField of Name
        } 
        if (menuURL.length < 1) {
            // set error message on TextField of URL
            
        }

        if (menuName.length > 0 && menuURL.length > 0) {
            this.props.createMenu({
                name: menuName,
                url: menuURL,
                parentId: parentMenuId
            })
        }
    }

    handleCancelButtonClick = event => {
        this.props.toggleComponent()
    }
    
    getExtraComponent = (isFetching, status) => {
        if (isFetching === true) {
            return <LinearProgress/>
        }

        switch(status) {
            case fetchStatus.FETCH_SUCCESS:
                return <Typography variant="caption" style={{ color: 'green' }}>Success</Typography>
            case fetchStatus.FETCH_FAIL:
                return <Typography variant="caption" color='error'>Failed</Typography>
            default:
                return
        }
    }

    render() {
        const { classes, menus, isFetching, status } = this.props;
        return (
            <div className={classes.createMenuContainer} onKeyUp={this.handleKeyUp}>
                <TextField className={classes.menuName} fullWidth={true} required label="Menu Name" margin="normal" onChange={this.handleNameChange}/>
                <TextField className={classes.menuUrl} fullWidth={true} required label="Menu's URL" margin="normal" onChange={this.handleURLChange}/>
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
                            {menus.map(menu => <MenuItem key={menu.id} value={menu.id}>{menu.name}</MenuItem>)}
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