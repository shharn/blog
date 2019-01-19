// @flow
import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
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
                    <Fab 
                        component={Link} 
                        to={`/admin/article?prev=${encodeURI(this.props.location.pathname)}`} 
                        className={classes.createButton} 
                        color='secondary'
                        size='small'
                        aria-label='create article'>
                        <AddIcon/>
                    </Fab>
                }
                <ArticleList {...rest}/>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ArticleListWrapper);