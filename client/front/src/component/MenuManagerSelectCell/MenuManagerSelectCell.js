// @flow
import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import type { 
    Menu,
    WithStylesProps
 } from '../../flowtype';

type Props = {
    menus: Array<Menu>,
    menu: Menu,

    updateMenu: (menu: Menu) => void
};

const NO_PARENT_MENU: string = '0';

class MenuManagerSelectCell extends Component<Props & WithStylesProps> {
    handleChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
        const parent = this.props.menu.parent == null ?  { uid: NO_PARENT_MENU } : this.props.menu.parent[0];
        const selectedParentId = e.target.value;
        if (parent.uid !== selectedParentId) {
            let maybeCloned = { ...this.props.menu };
            maybeCloned.parent = selectedParentId === NO_PARENT_MENU ? null : [{ uid: e.target.value }];
            this.props.updateMenu(maybeCloned);
        }
    }

    render = () => {
        const parent = this.props.menu.parent == null ?  { uid: NO_PARENT_MENU } : this.props.menu.parent[0];
        return (
            <TableCell
                classes={{
                    root: this.props.classes.root
                }}>
                <Select
                    value={parent.uid}
                    onChange={this.handleChange}
                    inputProps={{
                        name: 'selectedParentId',
                        id: 'parentId'
                    }}
                >
                    {this.props.menus.map(menu => <MenuItem key={`select:${menu.uid}`} value={menu.uid}>{menu.name}</MenuItem>)}
                </Select>
            </TableCell>
        );
    }
}

export default withStyles(styles)(MenuManagerSelectCell);