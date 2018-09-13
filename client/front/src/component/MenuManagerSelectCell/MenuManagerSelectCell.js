// @flow
import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import type { Menu } from '../../flowtype';

type Props = {
    menus: Array<Menu>,
    menu: Menu,

    updateMenu: (menu: Menu) => void
};

class MenuManagerSelectCell extends Component<Props> {
    handleChange = (e: any): void => {
        const parent = this.props.menu.parent == null ?  { uid: '0' } : this.props.menu.parent[0];
        const selectedParentId = e.target.value;
        if (parent.uid !== selectedParentId) {
            let maybeCloned = { ...this.props.menu };
            maybeCloned.parent = selectedParentId === '0' ? null : [{ uid: e.target.value }];
            this.props.updateMenu(maybeCloned);
        }
    }

    render() {
        const parent = this.props.menu.parent == null ?  { uid: '0' } : this.props.menu.parent[0];
        return (
            <TableCell>
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

export default MenuManagerSelectCell;