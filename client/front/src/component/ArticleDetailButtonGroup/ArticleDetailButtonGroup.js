// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import styles from './styles';
import type { WithStylesProps} from '../../flowtype';

type Props = {
    isAuthenticated: boolean,
    parentURL: string
};

class ArticleDetailButtonGroup extends Component<Props & WithStylesProps> {
    render = () => {
        const { classes, isAuthenticated, parentURL } = this.props;
        return (
            <div className={classes.container}>
                <Button component={Link} to={parentURL} className={cn(classes.button, classes.listButton)}><ListIcon fontSize='inherit'/></Button>
                {isAuthenticated && 
                    <Button 
                        classes={{ root: cn(classes.button, classes.iconButton)}}
                        onClick={this.props.onDeleteButtonClicked}
                    >
                        <DeleteIcon/>
                    </Button>}
                {isAuthenticated && 
                    <Button 
                        classes={{ root: cn(classes.button, classes.iconButton)}}
                        onClick={this.props.onEditButtonClicked}
                    >
                        <EditIcon fontSize='inherit'/>
                    </Button>}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleDetailButtonGroup);