// @flow
import React, { Component } from 'react';
import Table, { TableHead, TableRow, TableBody, TableCell } from 'material-ui/Table';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import MenuTableRow from '../MenuManagerTableRow';
import keycode from 'keycode';
import { withStyles } from 'material-ui/styles';
import styles from './styles';

import type { Menu } from '../../flowtype';

const headerNames = [
    'Name', 'URL', 'Parent', 'Delete'
];

type Props = {
    classes: any,
    menus: Array<Menu>,

    switchToList: () => void,
    switchToCreateMenu: () => void
}

class MeuList extends Component<Props> {
    onAddButtonClicked = () => {
        this.props.switchToCreateMenu();
    }

    render() {
        const { menus, classes } = this.props;
        return (
            <div className={classes.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headerNames.map(name => <TableCell variant='head' key={name}>{name}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menus.map(menu => <React.Fragment key={menu.id}><MenuTableRow key={menu.id} menu={menu}/></React.Fragment>)}
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