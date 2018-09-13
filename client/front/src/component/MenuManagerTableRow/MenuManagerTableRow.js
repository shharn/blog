// @flow
import * as React from 'react';
import TableRow from '@material-ui/core/TableRow';
import MenuTableCell from '../MenuManagerTableCell';
import DeleteButtonCell from '../DeleteButtonCell';
 
import type { Menu } from '../../flowtype';

const cellNames : Array<string> = [ 'name', 'url', 'parent' ];

type Props = {
    menu: Menu,

    deleteMenu: (uid: number) => void
};

class MenuManagerTableRow extends React.Component<Props> {
    deleteMenu = () => {
        this.props.deleteMenu(this.props.menu.uid);
    }

    getCells = (): Array<React.Element<typeof DeleteButtonCell>> => {
        let result = [];
        result = cellNames.map(cellName => <MenuTableCell key={`${this.props.menu.uid}:${cellName}`} menu={this.props.menu} cellName={cellName}/>);
        result.push(<DeleteButtonCell  key={`'deleteButton:${this.props.menu.uid}`} deleteMenu={this.deleteMenu} />);
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