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
import { withStyles } from 'material-ui/styles'
import { fetchStatus } from '../../constant'
import styles from './styles'

class CreateMenu extends Component {
    state = {
        menuName: '',
        menuURL: '',
        parentMenuId: -1,
    }

    componentDidUpdate() {
        this.props.status === fetchStatus.FETCH_SUCCESS && setTimeout(1000, this.props.toggleComponent)
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
        const  { menuName, menuURL, parentMenuId } = this.state
        if (menuName.length < 1) {
            // set error message on TextField of Name
        } 
        if (menuURL.length < 1) {
            // set error message on TextField of URL
            
        }

        if (menuName.lenght > 0 && menuURL.length > 0) {
            this.props.createMenu({
                menuName,
                menuURL,
                parentMenuId
            })
        }
    }

    handleCancelButtonClick = event => {
        this.props.toggleComponent()
    }
    
    render() {
        const { classes, menus } = this.props;
        return (
            <div className={classes.createMenuContainer}>
                <TextField className={classes.menuName} required label="Menu Name" margin="normal" onChange={this.handleNameChange}/>
                <TextField className={classes.menuUrl} required label="Menu's URL" margin="normal" onChange={this.handleURLChange}/>
                <div className={classes.dropboxContainer}>
                    <FormControl margin="normal" className={classes.formControl}>
                        <InputLabel htmlFor="parentMenu">Parent Menu</InputLabel>
                        <Select
                            value={this.state.parentMenuId}
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
                    {this.props.isFetching && <LinearProgress/>}
                    {this.props.status === fetchStatus.FETCH_FAIL && <span style={{color: 'red'}}>Error Message</span>}
                    {this.props.status === fetchStatus.FETCH_SUCCESS && <span style={{color: 'green'}}>Succeeded!</span>}
                    <IconButton className={classes.iconButton} aria-label="confirm" color="default">
                        <SaveIcon/>
                    </IconButton>
                    <IconButton className={classes.iconButton} aria-label="cancel" onClick={this.handleCancelButtonClick} color="default">
                        <ClearIcon/>
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CreateMenu);