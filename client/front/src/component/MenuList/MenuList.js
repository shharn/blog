// @flow
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Fab } from '@material-ui/core';
import MenuTableRow from '../MenuManagerTableRow';
import styles from './styles';
import { FetchStatus } from '../../constant';
import type { 
    Menu,
    WithStylesProps
 } from '../../flowtype';
import type { Mutation } from '../../reducer/data/mutation';

const headerNames: Array<string> = [
    'Name', 'URL', 'Parent', 'Delete'
];

type Props = {
    isEditable: boolean,
    editableRowId: number,
    editableCellName: string,
    menus: Array<Menu>,
    updateMutationStatus: Mutation,
    deleteMutationStatus: Mutation,

    switchToList: () => void,
    switchToCreateMenu: () => void,

    changeEditableCell: (rowId: number, cellName: string) =>void,
    updateMenu: (menu: Menu) => void,
    deleteMenu: (uid: number) => void
};

class MeuList extends React.Component<Props & WithStylesProps> {
    onAddButtonClicked = (): void => {
        this.props.switchToCreateMenu();
    }

    getErrorMessage = (): string => {
        const { updateMutationStatus, deleteMutationStatus } = this.props;
        return updateMutationStatus.status === FetchStatus.FAIL ?
            updateMutationStatus.error.message : deleteMutationStatus.error.message;
    }

    render = () => {
        const { menus, classes, updateMutationStatus, deleteMutationStatus } = this.props;
        const isEmpty = (updateMutationStatus === FetchStatus.SUCCESS || deleteMutationStatus === FetchStatus.SUCCESS) &&
            (menus && menus.length);
        return (
            <div className={classes.tableContainer}>
                {isEmpty ? 
                    <Typography 
                        className={classes.emptyMessage}
                        variant="h6"  
                        align="center">
                        No Menu :(
                    </Typography> :
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headerNames.map(name => 
                                    <TableCell 
                                        classes={{
                                            root: classes.cellRoot
                                        }}
                                        variant='head' 
                                        key={name}>
                                        {name}
                                    </TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menus.map(menu => <MenuTableRow key={menu.uid} menu={menu}/>)}
                        </TableBody>
                    </Table>
                }
                {(updateMutationStatus.status === FetchStatus.FAIL || deleteMutationStatus.status === FetchStatus.FAIL) &&
                    <Typography
                        variant="body1"
                        align="center">
                        {this.getErrorMessage()} 
                    </Typography>
                }
                <Fab classes={{ root: classes.addButton }} size="small" color="secondary" aria-label="add" onClick={this.onAddButtonClicked}>
                    <AddIcon/>
                </Fab>
            </div>
        );
    }
}

export default withStyles(styles)(MeuList);