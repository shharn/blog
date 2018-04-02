// @flow
import React, { Component } from 'react';
import { TableRow } from 'material-ui/Table';
import MenuTableCell from '../MenuManagerTableCell';
import DeleteButtonCell from '../DeleteButtonCell';
 
import type { Menu } from '../../flowtype';

type Props = {
    menu: Menu,

    deleteMenu: (id: number) => void
};

class MenuManagerTableRow extends Component<Props> {
    deleteMenu = () => {
        this.props.deleteMenu(this.props.menu.id);
    }

    getCells = () => {
        const { id: _, ...withoutId } = this.props.menu;
        let result = [];
        for (var cellName in withoutId) {
            result.push(<MenuTableCell key={`${this.props.menu.id}:${cellName}`} menu={this.props.menu} cellName={cellName}/>);
        }
        result.push(<DeleteButtonCell  key={`'deleteButton:${this.props.menu.id}`} deleteMenu={this.deleteMenu} />);
        return result;
    }

    render() {
        return (
            <TableRow>
                {this.getCells()}
            </TableRow>
        );
    }
}

export default MenuManagerTableRow;