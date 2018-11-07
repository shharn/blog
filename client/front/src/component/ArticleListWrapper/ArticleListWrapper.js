// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ArticleList from '../ArticleList';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import type {
    RouterProps,
    WithStylesProps
} from '../../flowtype';

type Props = {
    isAuthenticated: boolean
};

class ArticleListWrapper extends Component<Props & RouterProps & WithStylesProps> {
    render = () => {
        const { isAuthenticated, classes, ...rest } = this.props;
        return (
            <React.Fragment>
                {isAuthenticated &&
                    <Button 
                        component={Link} 
                        to={`/admin/article?prev=${encodeURI(this.props.location.pathname)}`} 
                        className={classes.createButton} 
                        variant="fab" 
                        mini 
                        color="secondary" 
                        aria-label="create article">
                        <AddIcon/>
                    </Button>
                }
                <ArticleList {...rest}/>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ArticleListWrapper);