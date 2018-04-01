import React, { Component } from 'react';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { TableCell } from 'material-ui/Table';
import type { Menu } from '../../flowtype';

type Props = {
    menus: Array<Menu>,
    menu: Menu,

    updateMenu: (menu: Menu) => void
};

class MenuManagerSelectCell extends Component<Props> {
    handleChange = event => {
        if (this.props.menu.parentId !== event.target.value) {
            let maybeCloned = { ...this.props.menu, parentId: event.target.value };
            this.props.updateMenu(maybeCloned);
        }
    }

    render() {
        return (
            <TableCell>
                <Select
                    value={this.props.menu.parentId}
                    onChange={this.handleChange}
                    inputProps={{
                        name: 'selectedParentId',
                        id: 'parentId'
                    }}
                >
                    {this.props.menus.map(menu => <MenuItem key={`select:${menu.id}`} value={menu.id}>{menu.name}</MenuItem>)}
                </Select>
            </TableCell>
        );
    }
}

export default MenuManagerSelectCell;