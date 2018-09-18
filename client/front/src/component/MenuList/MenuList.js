// @flow
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import MenuTableRow from '../MenuManagerTableRow';
import styles from './styles';
import type { 
    Menu,
    WithStylesProps
 } from '../../flowtype';

const headerNames = [
    'Name', 'URL', 'Parent', 'Delete'
];

type Props = {
    isEditable: boolean,
    editableRowId: number,
    editableCellName: string,
    menus: Array<Menu>,

    switchToList: () => void,
    switchToCreateMenu: () => void,

    changeEditableCell: (rowId: number, cellName: string) =>void,
    disableEditableCell: () => void,
    updateMenu: (menu: Menu) => void,
    deleteMenu: (uid: number) => void
};

class MeuList extends React.Component<Props & WithStylesProps> {
    onAddButtonClicked = (): void => {
        this.props.switchToCreateMenu();
    }

    onKeyDown = (e: SyntheticKeyboardEvent<HTMLElement>): void => {
        this.props.disableEditableCell();
    }

    render = () => {
        const { menus, classes } = this.props;
        return (
            <div className={classes.tableContainer} onKeyDown={this.onKeyDown}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headerNames.map(name => <TableCell variant='head' key={name}>{name}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menus.map(menu => <MenuTableRow key={menu.uid} menu={menu}/>)}
                    </TableBody>
                </Table>
                <Button className={classes.addButton} variant="fab" mini color="secondary" aria-label="add" onClick={this.onAddButtonClicked}>
                    <AddIcon/>
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(MeuList);