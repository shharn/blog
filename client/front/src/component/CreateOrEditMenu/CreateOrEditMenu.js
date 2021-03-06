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
import type { Element } from 'react';
import type { 
    Menu,
    WithStylesProps,
    RouterProps
 } from '../../flowtype';

type Props = {
    menus: Array<Menu>,
    status: $Values<FetchStatus>,
    isFetching: boolean,
    isEditMode: boolean,
    menu: Menu,
    
    switchToList: () => void,

    getMenus: () => void,
    createMenu: (menu: Menu) => void,
    updateMenu: (menu: Menu) => void,
    initializeStatus: () => void
};

type State = {
    menuName: string,
    menuURL: string,
    parentMenuId: string
};

const EMPTY_MENU_ID: string = '0';

class CreateOrEditMenu extends Component<Props & WithStylesProps & RouterProps, State> {
    state = {
        menuName: '',
        menuURL: '',
        parentMenuId: EMPTY_MENU_ID,
    }

    componentDidMount = () => {
        if (this.props.isEditMode) {
            const { menu } = this.props;
            this.setState({
                menuName: menu.name,
                menuURL: menu.url,
                parentMenuId: menu.parent ? menu.parent[0].uid : EMPTY_MENU_ID
            });
        }
    }

    componentDidUpdate = () => {
        this.props.status === FetchStatus.SUCCESS && setTimeout(this.props.switchToList, 1000);
    }

    componentWillUnmount = () => {
        this.props.initializeStatus();
        this.props.status === FetchStatus.SUCCESS && this.props.getMenus();
    }

    handleNameChange = (event: SyntheticInputEvent<HTMLInputElement>): void => {
        this.setState({ menuName: event.target.value });
    }

    handleURLChange = (event: SyntheticInputEvent<HTMLInputElement>): void => {
        this.setState({ menuURL: event.target.value });
    }

    handleParentMenuChange = (event: SyntheticInputEvent<HTMLSelectElement>): void => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmitButtonClick = (): void => {
        const { menuName, menuURL, parentMenuId } = this.state;
        const { isEditMode, menu } = this.props;
        if (menuName.length < 1) {
            // set error message on TextField of Name
            return;
        } 

        // If no parent, should not include the parent property
        let data: {
            uid?: string,
            name: string,
            url: string,
            parent?: Array<{ uid: string }>
        };
        if (isEditMode === true) {
            data = { ...menu, name: menuName, url: menuURL };
            if (!data.parent && parentMenuId !== EMPTY_MENU_ID) { // parent menu : None -> Some menu
                data.parent = [ { uid: parentMenuId } ];
            } else if (data.parent && data.parent[0].uid !== parentMenuId) { // parent menu : Some menu -> Other menu
                data.parent = parentMenuId === EMPTY_MENU_ID ? null : [ { uid: parentMenuId } ];
            }
        } else {
            data = {
                name: menuName,
                url: menuURL
            };
            parentMenuId !== EMPTY_MENU_ID && (data.parent = [  { uid: parentMenuId } ]);
        }
        isEditMode === true ? this.props.updateMenu(data) : this.props.createMenu(data);
    }

    handleCancelButtonClick = (): void => {
        this.props.switchToList();
    }
    
    getStatueIndicator = (): Element<*> | null => {
        const status: $Values<FetchStatus> = this.props.status;
        switch(status) {
            case FetchStatus.WAIT:
                return <LinearProgress/>;
            case FetchStatus.SUCCESS:
                return <Typography variant="caption" style={{ color: 'green' }}>Success</Typography>;
            case FetchStatus.FAIL:
                return <Typography variant="caption" color='error'>Failed</Typography>;
            default:
                return null;
        }
    }

    render = () => {
        const { classes, menus, menu, isEditMode } = this.props;
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
                    {this.getStatueIndicator()}
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