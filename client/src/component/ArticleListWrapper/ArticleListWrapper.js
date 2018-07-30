import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ArticleList from '../ArticleList';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class ArticleListWrapper extends Component {
    render() {
        const { isAuthenticated, classes, ...rest } = this.props;
        return (
            <div>
                {isAuthenticated && 
                    <Button component={Link} to="/admin/article" className={classes.createButton} variant="fab" mini color="secondary" aria-label="create article">
                        <AddIcon/>
                    </Button>}
                <ArticleList {...rest}/>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ArticleListWrapper);