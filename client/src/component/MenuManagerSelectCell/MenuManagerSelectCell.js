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
        const parent = this.props.menu.parent == null ?  { uid: '0' } : this.props.menu.parent[0];
        if (parent.uid !== event.target.value) {
            let maybeCloned = { ...this.props.menu, 
                parent: [
                    {
                        ...this.props.menu.parent,
                        uid: event.target.value 
                    }
                ]
            };
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