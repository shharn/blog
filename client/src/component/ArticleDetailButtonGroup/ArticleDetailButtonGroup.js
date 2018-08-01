import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class ArticleDetailButtonGroup extends Component {
    render() {
        const { classes, isAuthenticated, parentURL } = this.props;
        return (
            <div className={classes.container}>
                <Button component={Link} to={parentURL} className={classes.button + ' ' + classes.listButton}><ListIcon fontSize='inherit'/></Button>
                {isAuthenticated && <Button classes={{ root: classes.button + ' ' + classes.editButton}}><EditIcon fontSize='inherit'/></Button>}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme : true })(ArticleDetailButtonGroup);